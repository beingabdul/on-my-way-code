
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
    limit = exportData.limit
    getChatRooms()
})

function getChatRooms() {
    var rooms = []
    var collectionRef = collection(db, "chat_rooms")
    var q = query(collectionRef,where("support_chat","==",true))
    getDocs(q).then(function (querySnapshot) {
        if (querySnapshot.size > 0) {
            querySnapshot.forEach(function (doc) {
                var data = doc.data()
                var name = data.name
                let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
                let initials = [...name.matchAll(rgx)] || []
                initials = (
                    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
                ).toUpperCase()
                var ChatUser = ""
                data.users.forEach(function(item){
                    if(item != "support"){
                        ChatUser = item
                    }
                })

                var chatrooms = '<li data-room="' + data.key + '" onclick="openchat(\'' + data.key + '\',\'' + data.name + '\',\'' + ChatUser + '\')" class="clearfix "><span class="user-name-initial">'+initials+'</span><div class="about"><div data-userName="' + data.key + '" class="name">' + data.name + '</div><div data-lastmessage="' + data.key + '" class="status"></div></div><span data-unread="' + data.key + '" class="badge chat-badge"></span></li>'
                $('.chat-list').append(chatrooms)
                rooms.push(data.key)
            })
        }
    }).then(function (ref) {
        $('#plzChat').show()
        $('.chat-header').hide()
        $('.chat-form').hide()
        $(".chat-list").niceScroll()
        getLastMessage(rooms)
        getUnreadMessages(rooms)
    })
    .catch(function (error) {
        console.log("Error Getting Documents", error)
    })
}

$("#chat-form").submit(function (e) {
    e.preventDefault()
    var myDate = new Date()
    var timestamp = myDate.getTime()
    var room_id = $('#room_id').val()
    var reciever_id = $('#receiverId').val()
    var me = $(this)
    if (me.find('input').val().trim().length == 0) {
        return false
    }
    var message = me.find('input').val()
    me.find('input').val('')
    var chatRef = doc(db,"chat",timestamp.toString())
    setDoc(chatRef,{
        created_at: new Date(),
        body: message,
        chat_room_id: room_id,
        sender_id: "support",
        is_seen: false,
        receiver_id: reciever_id,
    }).then(function (mes) {

    })
    .catch(function (error) {
        console.log("Error Getting Documnets", error)
    })
})

function getUnreadMessages(room_id) {
    room_id.forEach(function (item) {
        var collectionRef = collection(db, "chat")
        var q = query(collectionRef,where("chat_room_id","==",item),where("sender_id","!=","support"),where("is_seen","==",false))
        onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.size > 0) {
                var count = querySnapshot.size
                $('.chat-list').find("[data-unread='" + item + "']").html(count)
            }
            else {
                $('.chat-list').find("[data-unread='" + item + "']").html("")
            }
        })
    })
}

function getLastMessage(room_id) {
    room_id.forEach(function (item) {
        var collectionRef = collection(db, "chat")
        var q = query(collectionRef,where("chat_room_id","==",item),orderBy("created_at","desc"),limit(1))
        onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.size > 0) {
                querySnapshot.forEach(function (doc) {
                    var data = doc.data()
                    $('.chat-list').find("[data-lastmessage='" + item + "']").html(data.body.substr(0, 20))
                })
            }
        })
    })
}

function openchat(room_id, name,ChatUser) {
    if ($('#room_id').val() == room_id) {
    }
    else if ($('#room_id').val() != "") {
        var item = $('#room_id').val()
        $('.chat-list').find("[data-room='" + room_id + "']").addClass('active')
        $('.chat-list').find("[data-room='" + item + "']").removeClass('active')
    }
    else {
        $('.chat-list').find("[data-room='" + room_id + "']").addClass('active')
    }
    $('.chat-header').show()
    $('.chat-form').show()

    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
    let initials = [...name.matchAll(rgx)] || []
    initials = (
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase()

    $('#header-name').html(initials)
    $('.chat-with').html(name)
    $('.chat-num-messages').html("")
    
    // $('.chat-num-messages').html(room_id)
    $('#receiverId').val(ChatUser)
    $('#room_id').val(room_id)

    appendMessages(room_id,name)
    
}

function appendMessages(room_id,name) {
    $('.chat-content').empty()
    $('.recipient-name').html(room_id)
    var collectionRef = collection(db, "chat")
    var q = query(collectionRef,where("chat_room_id","==",room_id),orderBy("created_at","asc"))
    onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.size > 0) {
            $('.chat-content').empty()
            querySnapshot.forEach(function (doc) {
                var data = doc.data()
                var timestamp = data.created_at.toDate()
                timestamp = $.format.date(timestamp, 'HH:mm')
                var image_url = $('#AdminImage').val()
                if (data.sender_id == "support") {
                    if (data.is_seen == true) {
                        var message = '<div class="chat-item chat-right" style=""><img src="'+image_url+'"><div class="chat-details"><div>Admin</div><div class="chat-text">' + data.body + '<div><i style="float:rightcolor:#ffffff" class="fas fa-check-double"></i></div ></div><div class="chat-time">' + timestamp + '</div></div></div>'
                    }
                    else {
                        var message = '<div class="chat-item chat-right" style=""><img src="'+image_url+'"><div class="chat-details"><div>Admin</div><div class="chat-text">' + data.body + '<div><i style="float:right" class="fas fa-check"></i></div></div><div class="chat-time">' + timestamp + '</div></div></div>'
                    }
                }
                else {
                    if (data.is_seen == true) {
                        var message = '<div class="chat-item chat-left" style=""><img src="'+image_url+'"><div class="chat-details"><div>'+name+'</div><div class="chat-text">' + data.body + '</div><div class="chat-time">' + timestamp + '</div></div></div>'
                    }
                    else {
                        var message = '<div class="chat-item chat-left" style=""><img src="'+image_url+'"><div class="chat-details"><div>'+name+'</div><div class="chat-text">' + data.body + '</div><div class="chat-time">' + timestamp + '</div></div></div>'
                    }
                }
                $('.chat-content').append(message)
                $(".chat-content").niceScroll()
                var d = $('.chat-content')
                d.scrollTop(d.prop("scrollHeight"))
                readMessages(room_id)
            })
        }
    })
}

function readMessages(room_id) {
    var collectionRef = collection(db, "chat")
    var q = query(collectionRef,where("chat_room_id","==",room_id),where("sender_id","!=","support"))
    getDocs(q).then(function (querySnapshot) { 
        if (querySnapshot.size != 0) {
            querySnapshot.forEach(function (docSnapshot) {
                var ref = doc(db,"chat",docSnapshot.id)
                updateDoc(ref,{
                    is_seen: true,
                })
            })
        }
    })
    .catch(function (error) {
        console.log("Error Getting Documnets", error)
    })
}

function searchFilter() {
    var input, filter, ul, li, a, i, txtValue
    input = document.getElementById("searchinput")
    filter = input.value.toUpperCase()
    ul = document.getElementById("chat-contacts")
    li = ul.getElementsByTagName("li")
    for (i = 0 ;i < li.length; i++) {
        a = li[i].getElementsByTagName("div")[0]
        a = a.getElementsByTagName("div")[0]
        txtValue = a.textContent || a.innerText
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ""
        } else {
            li[i].style.display = "none"
        }
    }
}
 
