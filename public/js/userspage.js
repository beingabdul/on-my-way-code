var exportData
var db
var collection
var doc
var getDoc
var getDocs
var auth
var query
var where
var orderBy
var updateDoc
var deleteDoc
var setDoc
var onSnapshot
var realdb
var ref
var get
var child
var onValue
var runTransaction
$(async function () {
    await import('./firebase.js').then(function (exports) {
        exportData = exports
    })
    db = exportData.db
    doc = exportData.doc
    collection = exportData.collection
    getDoc = exportData.getDoc
    getDocs = exportData.getDocs
    query = exportData.query
    where = exportData.where
    orderBy = exportData.orderBy
    auth = exportData.auth
    updateDoc = exportData.updateDoc
    setDoc = exportData.setDoc
    deleteDoc = exportData.deleteDoc
    onSnapshot = exportData.onSnapshot
    createTable()
})
async function createTable() {
    var collectionRef = collection(db, "user")
    var q = query(collectionRef)
    try {
        getDocs(q).then(function (querySnapshot) {
            $("#table-1").DataTable().destroy()
            $("#dataTable").html('')
            if (querySnapshot.size > 0) {
                querySnapshot.forEach(function (doc) {
                    var data = doc.data()
                    if(!data.admin){
                        var email = data.email
                        var dateofbirth = data.dateofbirth
                        var description = data.description
                        var isattending = data.isattending
                        var currentcity = data.currentcity
                        var eyecolor = data.eyecolor
                        var fear = data.fear
                        var gender = data.gender
                        var height = data.height
                        var hobby = data.hobby
                        var religion = data.religion
                        var profession = data.profession
                        var image = data.image_url == ""? "default-user-icon-4.jpg" : data.image_url
                        var name = data.firstname??"" + " " + data.lastname??""
                        var status = data.status??"undefined"
                        
                        var imagePop = `<div class="image-link">
                                                <a class="image-popup-vertical-fit" href="${image}">
                                                    <img class="img-responsive thumbnail" src="${image}" width="35" height="30">
                                                </a>
                                            </div>`;

                        if(isattending){
                            var label2 = '<div class="badge badge-primary custombadge-shadow">Attending</div>'
                        }
                        else{
                            var label2 = ''
                        }

                        if(status == "undefined" || status == 1){
                            var label = '<div class="custombadge-outline col-green custombadge-shadow">Active</div>'
                            var action = '<a data-toggle="tooltip" title="Block User" style="color: #fff;cursor:pointer;margin-right:5px;" onclick="showBlockModal(\'' + doc.id + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-ban"></i></a><a data-toggle="tooltip" title="Delete User" style="color: #fff;cursor:pointer" onclick="showDeleteModal(\'' + doc.id + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>'
                            var rowId = "1"
                        }
                        else{
                            var label = '<div class="custombadge-outline col-red custombadge-shadow">Blocked</div>'
                            var action = '<a data-toggle="tooltip" title="Unblock User" style="color: #fff;cursor:pointer;margin-right:5px;" onclick="showUnBlockModal(\'' + doc.id + '\')" class="btn btn-success badge-shadow"><i class="fas fa-check-circle"></i></a><a data-toggle="tooltip" title="Delete User" style="color: #fff;cursor:pointer" onclick="showDeleteModal(\'' + doc.id + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>'
                            var rowId = "2"
                        }

                        var favouriteEvents = data.fvtevents.length > 0 ? `<a data-toggle="tooltip" title="Show Favourite Events" style="color: #fff;cursor:pointer" onclick="showEventsModal('${data.fvtevents}')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>` : "-"
                        var attendingEvents = data.attendingevents.length > 0 ? `<a data-toggle="tooltip" title="Show Attending Events" style="color: #fff;cursor:pointer" onclick="showEventsModal('${data.attendingevents}')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>` : "-"

                        var imagesList = "";
                        var rem = 0;
                        if (data.userimages != undefined && data.userimages.length) {
                            var checkImages = data.userimages;
                            var length = checkImages.length;
                            for (var count = 0; count < length; count++) {
                                if (count < 2) {
                                    imagesList += '<a href="' + data.userimages[count] + '">' +
                                        '<img class="img-responsive thumbnail" src="' + data.userimages[count] + '" width="35" height="30">' +
                                        '</a>';
                                }
                                else if (count == 2 && length > 3) {
                                    rem = length - (count + 1);
                                    imagesList += '<a href="' + data.userimages[count] + '" class="container234">' +
                                        '<img class="img-responsive thumbnail" src="' + data.userimages[count] + '" width="35" height="30">' +
                                        '<div class="overlay">' +
                                        '   <div class="text">+' + rem + '</div>' +
                                        '</div>' +
                                        '</a>';
                                }
                                else if (count > 2) {
                                    imagesList += '<a style="display:none;" href="' + data.userimages[count] + '">' +
                                        '<img class="img-responsive thumbnail" src="' + data.userimages[count] + '" width="35" height="30">' +
                                        '</a>';
                                }
                            }
                        }
                        else {
                            imagesList = "-";
                        }

                        var input = `
                            <input id="fullname-${doc.id}" type="hidden" value="${name}" />
                            <input id="email-${doc.id}" type="hidden" value="${email}" />
                            <input id="description-${doc.id}" type="hidden" value="${description}" />
                            <input id="dateofbirth-${doc.id}" type="hidden" value="${dateofbirth}" />
                            <input id="currentcity-${doc.id}" type="hidden" value="${currentcity}" />
                            <input id="fear-${doc.id}" type="hidden" value="${fear}" />
                            <input id="eyecolor-${doc.id}" type="hidden" value="${eyecolor}" />
                            <input id="gender-${doc.id}" type="hidden" value="${gender}" />
                            <input id="height-${doc.id}" type="hidden" value="${height}" />
                            <input id="hobby-${doc.id}" type="hidden" value="${hobby}" />
                            <input id="religion-${doc.id}" type="hidden" value="${religion}" />
                            <input id="profilephoto-${doc.id}" type="hidden" value="${image}" />
                            <input id="profession-${doc.id}" type="hidden" value="${profession}" />`  
    
                        var Usertd = '<div class="image-link text-center"><a href="' + image + '"><img style="width:30px;height:30px;" src="' + image + '"></a></div><h6 class="mb-0 font-13 pdt10 text-center">' + name + '</h6>'
                        var row = `<tr data-row="${rowId}">
                                
                                <td class="">${Usertd}</td>
                                <td>
                                    <h6 class="mb-0 font-13 pdt10">
                                        ${email}
                                        <a onclick="showUserInfo('${doc.id}')">
                                            <i class="fas fa-level-up-alt"></i>
                                        </a>
                                    </h6>
                                </td>
                                <td class="">${attendingEvents}</td>
                                <td class="">${favouriteEvents}</td>
                                
                                <td class="">${label2}</td>
                                <td class="">${label}</td>
                                <td class="">${action + input}</td>
                                </tr>`
                        $('#dataTable').append(row)
                    }
                    
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000)
            }
            $('[data-toggle="tooltip"]').tooltip()
            $('.image-link').lightGallery();
            $('#aniimated-thumbnials3').lightGallery({
                thumbnail: true,
                selector: 'a'
            });
            $('#table-1').DataTable()
        })
    }
    catch (ex) {
        console.log(ex)
    }
}

$("#all").click(function () {
    $('#active_tab').removeClass('active')
    $('#all').addClass('active')
    $('#block_tab').removeClass('active')
    var table = $('#table-1').DataTable()
    $.fn.dataTable.ext.search.pop()
    table.draw()
})

$("#active_tab").click(function () {
    $('#active_tab').addClass('active')
    $('#all').removeClass('active')
    $('#block_tab').removeClass('active')
    var table = $('#table-1').DataTable()
    $.fn.dataTable.ext.search.pop()
    table.draw()
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return $(table.row(dataIndex).node()).attr('data-row') == "1"
        }
    )
    table.draw()
})

$("#block_tab").click(function () {
    $('#active_tab').removeClass('active')
    $('#all').removeClass('active')
    $('#block_tab').addClass('active')
    var table = $('#table-1').DataTable()
    $.fn.dataTable.ext.search.pop()
    table.draw()
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return $(table.row(dataIndex).node()).attr('data-row') == "2"
        }
    )
    table.draw()
})

function showUserInfo(Id){
    var name = $(`#fullname-${Id}`).val()
    var currentcity = $(`#currentcity-${Id}`).val()
    var eyecolor = $(`#eyecolor-${Id}`).val()
    var fear = $(`#fear-${Id}`).val()
    var gender = $(`#gender-${Id}`).val()
    var height = $(`#height-${Id}`).val()
    var hobby = $(`#hobby-${Id}`).val()
    var religion = $(`#religion-${Id}`).val()
    var profession = $(`#profession-${Id}`).val()
    var email = $(`#email-${Id}`).val()
    var dateofbirth = $(`#dateofbirth-${Id}`).val()
    var profilephoto = $(`#profilephoto-${Id}`).val()
    var description = $(`#description-${Id}`).val()

    $('#name3,#name4').html(name)
    $('#name4').html(Id)
    $('#city3').html(currentcity)
    $('#eyecolor3').html(eyecolor)
    $('#fear3').html(fear)
    $('#gender3').html(gender)
    $('#height3').html(height)
    $('#hobby3').html(hobby)
    $('#religion3').html(religion)
    $('#profession3').html(profession)
    $('#email3').html(email)
    $('#dateofbirth3').html(dateofbirth)
    $('.author-box-job').html(description)
    $('#imageIcon3').attr('src',profilephoto)

    $('#userModal').modal("show")
}

function showBlockModal(Id) {
    Swal.fire({
        title: 'Are you sure you want to suspend?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm:true,
        preConfirm:(login)=>{
            return new Promise(async function (resolve, reject) {
                BlockEntity(Id,resolve,reject)
            })
        },
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        console.log("result",result)
        if (result.isConfirmed) {
            MixinSweet("Suspend Successfully","","success",2000)
            createTable()
        }
    })
}

function BlockEntity(Id,resolve,reject){
    updateDoc(doc(db, "user", Id),{
        status:0
    })
    .then( async function(){
        var getaUth = auth.getAuth()
        const user = getaUth.currentUser
        var res = await getResponseFromUrl("Get","block_unblock_user?userId="+ Id + '&status=' + 0 ,null,true,user.uid)
        console.log(res)
        resolve(res)
    })
    .catch(function(error){
        console.log(error)
        reject(error)
    })
}

function showUnBlockModal(Id) {
    Swal.fire({
        title: 'Are you sure you want to unblock user?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm:true,
        preConfirm:(login)=>{
            return new Promise(async function (resolve, reject) {
                UnBlockEntity(Id,resolve,reject)
            })
        },
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        console.log("result",result)
        if (result.isConfirmed) {
            MixinSweet("Unsuspend Successfully","","success",2000)
            createTable()
        }
    })
}

function UnBlockEntity(Id,resolve,reject){
    updateDoc(doc(db, "user", Id),{
        status:1
    })
    .then( async function(){
        var getaUth = auth.getAuth()
        const user = getaUth.currentUser
        var res = await getResponseFromUrl("Get","block_unblock_user?userId="+ Id + '&status=' + 1 ,null,false,user.uid)
        console.log(res)
        resolve(res)
    })
    .catch(function(error){
        console.log(error)
        reject(error)
    })
}


function showDeleteModal(Id) {
    Swal.fire({
        title: 'Are you sure you want to delete this user?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm:true,
        preConfirm:(login)=>{
            return new Promise(async function (resolve, reject) {
                DeleteEntity(Id,resolve, reject)
            })
        },
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("result",result)
            MixinSweet("Deleted Successfully","","success",2000)
            createTable()
        }
    })
}

function DeleteEntity(Id,resolve, reject){
    deleteDoc(doc(db, "user", Id))
    .then( async function(){
        var getaUth = auth.getAuth()
        const user = getaUth.currentUser
        var res = await getResponseFromUrl("Get","deleteUser?userId="+ Id ,null,true,user.uid)
        console.log(res)
        resolve(res)
    })
    .catch(function(error){
        console.log(error)
        reject(error)
    })
}

function showEventsModal(Events){
    $('#attendingEventsModal').modal("show")
    Events = Events.split(',')
    var length = Events.length
    var users = []
    $('#table-2').DataTable().destroy()
    $('#dataTable2').html("")
    Events.forEach(function(item){
        var docRef = doc(db, "Events",item)
        getDoc(docRef).then(function (querySnapshot) {
            if(querySnapshot.exists){
                var data = querySnapshot.data()
                var title = data.title
                var date = data.date.toDate()
                date = $.format.date(date, 'd-MMM-yyyy')
                var time = data.time
                var userId = data.user_id
                if(!users.includes(userId)){
                    users.push(userId)
                }
                var row = `<tr>
                                <td>
                                    ${item}
                                </td>
                                <td data-user="${userId}" class=""></td>
                                <td data-email="${userId}" class=""></td>
                                <td>
                                    ${title}
                                </td>
                                <td class="">${date}</td>
                                <td class="">${time}</td>
                                </tr>`
                        $('#dataTable2').append(row)
            }
        }).then(function(){
            length--
            if(length == 0){
                  GetUsers(users,"dataTable2")              
            }
        })
    })
}
function GetUsers(users,tbodyname){
    var length = users.length
    users.forEach(function(item){
        var docRef = doc(db, "user",item)
        getDoc(docRef).then(function (querySnapshot) {
            if(querySnapshot.exists){
                var data = querySnapshot.data()
                var image = data.image_url == ""? "default-user-icon-4.jpg" : data.image_url
                var name = data.firstname??"" + " " + data.lastname??""
                var Usertd = '<div class="text-center"><img style="width:30px;height:30px;" src="' + image + '"></div><h6 class="mb-0 font-13 pdt10 text-center">' + name + '</h6>'
                $(`#${tbodyname}`).find(`[data-user = ${item}]`).html(Usertd)
                $(`#${tbodyname}`).find(`[data-email = ${item}]`).html(data.email)
            }
        })
        .then(function(){
            length--
            if(length == 0){
                $('#table-2').DataTable() 
            }
        })
    })
}


var getResponseFromUrl = function (requestType, requestUrl, requestData,async,header) {
    return $.ajax({
        type: requestType,
        url: requestUrl,
        data: requestData,
        data: requestData,
        async: async,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + header)
        },
        success:function(data, textStatus, xhr) {
            console.log(xhr.status)
            console.log(data)
            var reponse = {
                code :xhr.status,
                data:data,
            }
            console.log(reponse)
            return reponse
        },
        error: function (error) {
            return error
        },
    })
}