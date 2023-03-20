var exportData;
var storage;
var db;
var collection;
var doc;
var getDoc;
var getDocs;
var auth;
var query;
var where;
var orderBy;
var updateDoc;
var addDoc;
var setDoc;
$(async function () {
    await import('./firebase.js').then(function (exports) {
        exportData = exports;
    });
    db = exportData.db;
    doc = exportData.doc;
    collection = exportData.collection;
    getDoc = exportData.getDoc;
    getDocs = exportData.getDocs;
    query = exportData.query;
    where = exportData.where;
    orderBy = exportData.orderBy;
    auth = exportData.auth;
    updateDoc = exportData.updateDoc;
    addDoc = exportData.addDoc;
    setDoc = exportData.setDoc;
    storage = exportData.storage;
})
function changePictureModal() {
    $('#changePictureModal').modal("show");
}
function changeAppLogoModal() {
    $('#changePictureModal2').modal("show");
}

$("#editProfileForm").submit(function (e) {
    e.preventDefault();
    var elem = $("#editPictureBtn");
    uid = $("#uid").val();
    $(elem).addClass('btn-progress disabled');

    if ($("#file").val() == "") {
        sweetMessage("Warning", "Please select file", "error", 2000);
        $(elem).removeClass('btn-progress disabled');
    }
    else {
        $("#progess_section").show();
        var file = $("#file").get(0).files[0];
        var name = (+new Date()) + '-' + file.name;
        var metadata = { contentType: file.type };
        var fileName = name;
        var storageRef = storage;
        var ref = storageRef.ref(storageRef.getStorage(), 'images');
        var uploadTask = storageRef.uploadBytesResumable(ref, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                var fixval = progress.toFixed(0);
                $("#bar").html(fixval + "%");
                $("#bar").css('width', progress + '%').attr('aria-valuenow', progress);
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                sweetMessage("Warning", error.message, "error");
            },
            () => {
                storageRef.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    create_reference(downloadURL, fileName);
                    console.log('File available at', downloadURL);
                });
            }
        );
    }
});

function create_reference(imageUrl, file_name) {
    var email = $('#email').val();
    var usrRef = doc(db, "user", email);
    updateDoc(usrRef,{
        image_url: imageUrl,
    })
        .then(function (ref) {
            $("#bar").css('width', '0%');
            $("#progess_section").fadeOut("slow");
            $("#changePictureModal").modal('hide');
            sweetMessage("Successfull!", "Profile picture updated successfully!", "success");
            $("#editPictureBtn").removeClass('btn-progress disabled');
            reset_image(imageUrl);
        })
        .catch(function (error) {
            sweetMessage("Warning!", error, "error", 5000);
        });

}

function reset_image(url) {
    $(".userImage").attr('src', url);
    $(".imageUrl").attr('src', url);
    
}

function change_tab(type) {
    $(".mytabs").removeClass('show');
    if (type == 1) {
        $("#show1").addClass('show');
        $("#tab1").show();
        $("#tab2").hide();
    }
    else if (type == 2) {
        $("#show2").addClass('show');
        $("#tab1").hide();
        $("#tab2").show();
    }
}

$("#editPasswordForm").submit(function (e) {
    e.preventDefault();
    uid = $("#uid").val();
    if ($(this).find("#password").val() != $(this).find("#password2").val()) {
        sweetMessage("Warning", "Password does not match.", "warning", 4000);
        $(this).find("#password").addClass('is-invalid');
        $(this).find("#password2").addClass('is-invalid');
    }
    else if ($(this).find("#password").val().length < 6) {
        sweetMessage("Warning", "Password length must be at least 6 characters or more.", "warning", 4000);
        $(this).find("#password").addClass('is-invalid');
        $(this).find("#password2").addClass('is-invalid');
    }
    else {
        $(this).find("#password").removeClass('is-invalid');
        $(this).find("#password2").removeClass('is-invalid');
        $(this).find("#password").addClass('is-valid');
        $(this).find("#password2").addClass('is-valid');
        $("#updatePwdBtn").addClass('btn-progress');
        var getaUth = auth.getAuth();
        const user = getaUth.currentUser;
        auth.updatePassword(user, $(this).find("#password").val()).then(() => {
            sweetMessage("Successfull!", "Password updated successfully!", "success", 4000);
            $("#updatePwdBtn").removeClass('btn-progress');
        }).catch((error) => {
            sweetMessage("Warning!", "Please Login again to reset" + error, "error", 4000);
        });
    }
});

function shower(type) {
    if (type == 1) {
        $("#closer").show();
        $("#shower").hide();
        $("#editBasicForm").find('input').attr('disabled', false);
    }
    else {
        $("#editBasicForm").find('input').attr('disabled', true);
        $("#closer").hide();
        $("#shower").show();
    }
}

$("#editBasicForm").submit(function (e) {
    e.preventDefault();
    var email = $("#email").val();
    if ($(this).find("#username").val() == "") {
        sweetMessage("Warning!", "Please enter your full name", "warning", 5000);
        return false;
    }

    else if ($(this).find("#username").val() == $('#prev-name').val()) {
        sweetMessage("Warning!", "No changes made!", "warning", 5000);
        return false;
    }
    $("#basicSbBtn").addClass('btn-progress');

    var usrRef = doc(db, "admin", email);
    updateDoc(usrRef,{
        name: $(this).find("#username").val(),
    })
        .then(function (ref) {
            sweetMessage("Successfull!", "Basic details updated successfully!", "success");
            $("#basicSbBtn").removeClass('btn-progress');
            $("#editBasicForm").find('input').attr('disabled', true);
            $("#closer").hide();
            $("#shower").show();
            setTimeout(function () {
                location.reload();
            }, 1000);
        })
        .catch(function (error) {
            $("#basicSbBtn").removeClass('btn-progress');
            sweetMessage("Warning!", error, "error", 5000);
        });

});

function image_validation(event, elem) {
    var file = event.target.files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        sweetMessage("Warning!", "Invalid file selected", "error", 5000);
        $("#file").val('');
    }
    else if (file.size > 2000000) {
        sweetMessage("Warning!", "File size must be 2 mb or less", "error", 5000);
        $("#file").val('');
    }
}