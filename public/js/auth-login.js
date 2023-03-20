var exportData;
var db;
var collection;
var doc;
var getDoc;
var auth;
$(async function () {
    await import('./firebase.js').then(function (exports) {
        exportData = exports;
    });
    db = exportData.db;
    doc = exportData.doc;
    collection = exportData.collection;
    getDoc = exportData.getDoc;
    auth = exportData.auth;

    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', (e) => {
        // make auth and firestore references
        e.preventDefault();
        const getauth = auth.getAuth();
        // get user info
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        if (email == "" || password == "") {

        }
        if (email == "") {
            $('#login-email').addClass('is-invalid');
            sweetMessage("Authentication Failed!", "Please Provide Login Credentials", "warning");
            return false;
        }
        else if (!validateEmail(email)) {
            $('#login-email').addClass('is-invalid');
            sweetMessage("Authentication Failed!", "Please Provide Login Credentials", "warning");
            return false;
        }
        else if (password == "") {
            $('#login-email').removeClass('is-invalid');
            $('#login-password').addClass('is-invalid');
            sweetMessage("Authentication Failed!", "Please Provide Login Credentials", "warning");
            return false;
        }
        
        //auth.setPersistence(getauth, auth.browserSessionPersistence)
        //    .then((ref) => {
        //        console.log(ref);
                // log the user in
                console.log("ssss")
                auth.signInWithEmailAndPassword(getauth, email, password).then((cred) => {
                    first();
                    async function first() {
                        console.log("aaaaaa",cred.user.uid)
                        $('#login-button').addClass("btn-progress");
                        var email2 = email.toLowerCase();
                        const docRef = doc(db, "user", cred.user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            var data = docSnap.data();
                            if (data.admin == true) {
                                $('#login-email').addClass('is-valid');
                                $('#login-password').addClass('is-valid');
                                $('#login-password').removeClass('is-invalid');

                                TimerSweet("Authentication Successful!", "You are logged in", "success",1500);
                                setTimeout(function () {
                                    second();
                                }, 1000);
                            }
                            else {
                                var getaUth = auth.getAuth();
                                auth.signOut(getaUth).then(() => {
                                }).then(function () {
                                    sweetMessage("Authentication Failed!", "Not Allowed To Sign in Admin Panel", "warning");
                                    $('#login-button').removeClass("btn-progress");
                                })
                                    .catch(function (error) {
                                    });
                            }
                        }
                        else {
                            console.log("No such document!");
                        }
                    }
                    function second() {
                        $('#login-button').removeClass("btn-progress");
                        window.location.href = "dashboard";
                    }
                })
                    .catch(function (error) {
                        console.log(error);
                        if (error.code == "auth/user-not-found") {
                            $('#login-email').addClass("is-invalid");
                            $('#login-password').addClass("is-invalid");
                        }
                        else if (error.code == "auth/wrong-password") {
                            $('#login-password').addClass("is-invalid");
                            $('#login-email').removeClass("is-invalid");
                        }
                        var errorMessage = error.message;
                        sweetMessage("Authentication Failed!", errorMessage, "warning");
                    });
            //})
            //.catch((error) => {
            //    console.log(error);
            //    // Handle Errors here.
            //    const errorCode = error.code;
            //    const errorMessage = error.message;
            //});
    });
})

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}