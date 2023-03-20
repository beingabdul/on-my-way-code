var exportData
var storage
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
    storage = exportData.storage
    SetTerms()
})

function SetTerms() {
    var docRef = doc(db,"config","terms_and_conditions")
    getDoc(docRef)
    .then(function (querySnapshot) {
        if (querySnapshot.exists) {
            var data = querySnapshot.data()
            $('#TermsBody').html(data.terms)
            $('.editor').html(data.terms)
        }
    })
    .then(function (ref) {
        var editor = new Quill('.editor', {
            modules: { toolbar: '.quill-toolbar' },
            theme: 'snow'
        })
    })
    .catch(function (error) {
        console.log("Error getting documents: ", error)
    })
}
function EditTerms() {
    $('#descriptionCard').hide()
    $('#editCard').show()
}
function hideEditSection() {
    $('#descriptionCard').show()
    $('#editCard').hide()
}
function UpdateTerms() {
    var content = $('.ql-editor').html()
    var termsRef = doc(db, "config", "terms_and_conditions")
        updateDoc(termsRef,{
            updated_at: new Date(),
            terms: content,
        })
            .then(function () {
                SetTerms()
                hideEditSection()
            })
            .catch(function (error) {
                console.log("Error", error)
            })
}
