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
    createTable()
})
async function createTable() {
    var collectionRef = collection(db, "ratings")
    var q = query(collectionRef)
    var users = []
    var events = []
    try {
        getDocs(q).then(function (querySnapshot) {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('')
            if (querySnapshot.size > 0) {
                var count = 0
                querySnapshot.forEach(function (docsnapshot) {
                    count++
                    var data = docsnapshot.data()
                    console.log(data)

                    if(data.rated_by_host){
                        var label1 = '<div class="badge badge-primary custombadge-shadow">Rated By Host</div>'
                    }
                    else{
                        var label1 = '<div class="badge badge-success custombadge-shadow">Rated By Attendee</div>'
                    }

                    var rating = `<div class="rating-stars text-center">
                    <ul id="stars">
                      <li class="star selected" title="Poor" data-value="1">
                        <i class="fa fa-star fa-fw"></i>
                      </li>
                      <li class="star ${data.rating >1 ?'selected':''}" title="Fair" data-value="2">
                        <i class="fa fa-star fa-fw"></i>
                      </li>
                      <li class="star ${data.rating >2 ?'selected':''}" title="Good" data-value="3">
                        <i class="fa fa-star fa-fw"></i>
                      </li>
                      <li class="star ${data.rating >3 ?'selected':''}" title="Excellent" data-value="4">
                        <i class="fa fa-star fa-fw"></i>
                      </li>
                      <li class="star ${data.rating >4 ?'selected':''}" title="WOW!!!" data-value="5">
                        <i class="fa fa-star fa-fw"></i>
                      </li>
                    </ul>
                  </div>`


                    var input = `<input id="r-${docsnapshot.id}" type="hidden" value="${data.review}" />`
                    var review = '<a style="color: #fff;cursor:pointer" onclick="showRatingModal(\'' + docsnapshot.id + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>' + input
                    var row = `<tr>
                            <td class="">${count}</td>
                            <td data-event="${data.eventid}" class=""></td>
                            <td data-user="${data.hostid}" class=""></td>
                            <td data-user="${data.attendeeid}" class=""></td>
                            <td>${label1}</td>
                            <td class="">${rating}</td>
                            <td class="">${review}</td>
                            </tr>`
                    $('#dataTable').append(row)
                    !events.includes(data.eventid) ? events.push(data.eventid):""
                    !users.includes(data.attendeeid) ? users.push(data.attendeeid):""
                    !users.includes(data.hostid) ? users.push(data.hostid):""
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000)
            }
            getEvents(events,users)
        })
    }
    catch (ex) {
        console.log(ex)
    }
}
function getEvents(events,users){
    var length = events.length
    events.forEach(function(item){
        var docRef = doc(db, "Events",item)
        getDoc(docRef).then(function (querySnapshot) {
            if(querySnapshot.exists){
                var data = querySnapshot.data()
                var title = data.title
                $(`#dataTable`).find(`[data-event = ${item}]`).html(title)
            }
        })
        .then(function(){
            length--
            if(length == 0){
                GetUsers(users)
            }
        })
    })
}
function GetUsers(users) {
    var length = users.length
    users.forEach(function (item) {
        var docRef = doc(db, "user", item)
        getDoc(docRef).then(function (querySnapshot) {
            if (querySnapshot.exists) {
                var data = querySnapshot.data()
                var image = data.image_url == "" ? "default-user-icon-4.jpg" : data.image_url
                var email = data.email
                var Usertd = '<div class="text-center"><img style="width:30px;height:30px;" src="' + image + '"></div><h6 class="mb-0 font-13 pdt10 text-center">' + email + '</h6>'
                $(`#dataTable`).find(`[data-user = ${item}]`).html(Usertd)
            }
        })
            .then(function () {
                length--
                if (length == 0) {
                    $('#table-1').DataTable()
                }
            })
    })
}
function showRatingModal(Id){
    var view= $('#r-' + Id).val()
    $('#ViewBody').html(view)
    $('#viewModal').modal("show")
}
