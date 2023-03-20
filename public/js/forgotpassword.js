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
})
function forgotPassword() {
    var email = $('#login-email').val();
    if (email != "") {
        auth.sendPasswordResetEmail(auth.getAuth(),email)
            .then(function () {
                sweetMessage("Success!", "Password reset email sent to your mail id", "success");
                $('#login-email').val("");
            })
            .catch(function (error) {
                sweetMessage("Warning!", error.message, "warning");
                console.log(error);
            });
    }

}