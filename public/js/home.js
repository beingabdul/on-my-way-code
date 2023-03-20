var exportData;
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
var onSnapshot;
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
    onSnapshot = exportData.onSnapshot;
    SetSocialMediaLogin()
    ShowChart()
    ShowEventChart()

    var collectionRef = collection(db, "user");
    var q = query(collectionRef);
    getDocs(q).then(function (querySnapshot) {
        $('#UsersCount').html(querySnapshot.size);
    })

    var collectionRef2 = collection(db, "user");
    var q2 = query(collectionRef2, where("status", "==", 0));
    getDocs(q2).then(function (querySnapshot) {
        $('#BlockedUsers').html(querySnapshot.size);
    })

    var collectionRef = collection(db, "Events");
    var q = query(collectionRef, where("date", ">=", new Date()));
    getDocs(q).then(function (querySnapshot) {
        $('#UpcomingEvents').html(querySnapshot.size);
    })

    var collectionRef = collection(db, "chat");
    var q = query(collectionRef, where("receiver_id", "==", "support"), where("is_seen", "==", false));
    getDocs(q).then(function (querySnapshot) {
        $('#UnreadMessages').html(querySnapshot.size);
    })
})

function SetSocialMediaLogin(){
    var docref = doc(db,"config","social_media_logins")
    getDoc(docref).then(function(querySnapshot){
        if(querySnapshot.exists){
            var data = querySnapshot.data()
            data.facebook == true ? $('#facebook').prop("checked",true):$('#facebook').prop("checked",false)
            data.linkedin == true ? $('#linkedin').prop("checked",true):$('#linkedin').prop("checked",false)
            data.google == true ? $('#google').prop("checked",true):$('#google').prop("checked",false)

            data.facebook == true ? $('.btn-facebook').show():$('.btn-facebook').hide()
            data.linkedin == true ? $('.btn-linkedin').show():$('.btn-linkedin').hide()
            data.google == true ? $('.btn-google').show():$('.btn-google').hide()
        }
    }).catch(function(error){
        console.log("error",error)
    })
}

function editModal(){
    $('#editModal').modal("show")
}

function UpdateSocialLogin(){
    var facebook = $('#facebook').prop("checked")
    var linkedin = $('#linkedin').prop("checked")
    var google = $('#google').prop("checked")

    console.log(facebook,linkedin,google)
    
    var docref = doc(db,"config","social_media_logins")
    updateDoc(docref,{
        facebook:facebook,
        google:google,
        linkedin:linkedin,
    })
    .then(function(){
        MixinSweet("Successfully Updated","","success")
        $('#editModal').modal("hide")
        SetSocialMediaLogin()
    })
    .catch(function(error){
        console.log("error",error)
    })
}



async function ShowChart() {
    var collectionRef = collection(db, "user");
    var q = query(collectionRef);

    var jant = 0; var febt = 0; var mart = 0; var aprt = 0; var mayt = 0; var junet = 0; var julyt = 0; var augt = 0; var septt = 0;
    var octt = 0; var novt = 0; var dect = 0;
    getDocs(q).then(function (querySnapshot) {
        if (querySnapshot.size > 0) {

            var lastMonth = new Date(); var onePastlastMonth = new Date(); var twoPastlastMonth = new Date(); var threePastlastMonth = new Date();
            var fourPastlastMonth = new Date(); var fivePastlastMonth = new Date(); var sixPastlastMonth = new Date(); var sevenPastlastMonth = new Date();
            var eightPastlastMonth = new Date(); var ninePastlastMonth = new Date(); var tenPastlastMonth = new Date(); var elevenPastlastMonth = new Date();
            onePastlastMonth.setMonth(new Date().getMonth() - 1); twoPastlastMonth.setMonth(new Date().getMonth() - 2);
            threePastlastMonth.setMonth(new Date().getMonth() - 3); fourPastlastMonth.setMonth(new Date().getMonth() - 4); fivePastlastMonth.setMonth(new Date().getMonth() - 5);
            sixPastlastMonth.setMonth(new Date().getMonth() - 6); sevenPastlastMonth.setMonth(new Date().getMonth() - 7); eightPastlastMonth.setMonth(new Date().getMonth() - 8);
            ninePastlastMonth.setMonth(new Date().getMonth() - 9); tenPastlastMonth.setMonth(new Date().getMonth() - 10); elevenPastlastMonth.setMonth(new Date().getMonth() - 11);
            lastMonth.setDate(1); onePastlastMonth.setDate(1); twoPastlastMonth.setDate(1); elevenPastlastMonth.setDate(1); threePastlastMonth.setDate(1); fourPastlastMonth.setDate(1);
            fivePastlastMonth.setDate(1); sixPastlastMonth.setDate(1); sevenPastlastMonth.setDate(1); eightPastlastMonth.setDate(1); ninePastlastMonth.setDate(1); tenPastlastMonth.setDate(1);

            querySnapshot.forEach(function (docSnapshot) {
                var data = docSnapshot.data()
                if (data.admin) {

                }
                else {
                    var timestamp = data?.registered_at?.toDate() == null ? new Date() : data.registered_at.toDate()
                    console.log("timestamp", timestamp)
                    switch (timestamp.getMonth()) {
                        case lastMonth.getMonth():
                            jant++;
                            break;
                        case onePastlastMonth.getMonth():
                            febt++;
                            break;
                        case twoPastlastMonth.getMonth():
                            mart++;
                            break;
                        case threePastlastMonth.getMonth():
                            aprt++;
                            break;
                        case fourPastlastMonth.getMonth():
                            mayt++;
                            break;
                        case fivePastlastMonth.getMonth():
                            junet++;
                            break;
                        case sixPastlastMonth.getMonth():
                            julyt++;
                            break;
                        case sevenPastlastMonth.getMonth():
                            augt++;
                            break;
                        case eightPastlastMonth.getMonth():
                            septt++;
                            break;
                        case ninePastlastMonth.getMonth():
                            octt++;
                            break;
                        case tenPastlastMonth.getMonth():
                            novt++;
                            break;
                        case elevenPastlastMonth.getMonth():
                            dect++;
                            break;
                    }
                }

            })
        }
        else {
            console.log("No Data");
        }
        UpdateChart(jant, febt, mart, aprt, mayt, junet, julyt, augt, septt, octt, novt, dect)
    })
}
function getMonth(num) {
    if (num == 0) {
        return "Jan";
    }
    if (num == 1) {
        return "Feb";
    }
    if (num == 2) {
        return "Mar";
    }
    if (num == 3) {
        return "Apr";
    }
    if (num == 4) {
        return "May";
    }
    if (num == 5) {
        return "June";
    }
    if (num == 6) {
        return "July";
    }
    if (num == 7) {
        return "Aug";
    }
    if (num == 8) {
        return "Sept";
    }
    if (num == 9) {
        return "Oct";
    }
    if (num == 10) {
        return "Nov";
    }
    if (num == 11) {
        return "Dec";
    }
}
function getDay(num) {
    if (num == 0) {
        return "Sun";
    }
    if (num == 1) {
        return "Mon";
    }
    if (num == 2) {
        return "Tues";
    }
    if (num == 3) {
        return "Wed";
    }
    if (num == 4) {
        return "Thurs";
    }
    if (num == 5) {
        return "Fri";
    }
    if (num == 6) {
        return "Sat";
    }
}
function UpdateChart(jant, febt, mart, aprt, mayt, junet, julyt, augt, septt, octt, novt, dect) {

    var lastMonth = new Date(); var onePastlastMonth = new Date(); var twoPastlastMonth = new Date(); var threePastlastMonth = new Date();
    var fourPastlastMonth = new Date(); var fivePastlastMonth = new Date(); var sixPastlastMonth = new Date(); var sevenPastlastMonth = new Date();
    var eightPastlastMonth = new Date(); var ninePastlastMonth = new Date(); var tenPastlastMonth = new Date(); var elevenPastlastMonth = new Date();
    onePastlastMonth.setMonth(new Date().getMonth() - 1); twoPastlastMonth.setMonth(new Date().getMonth() - 2);
    threePastlastMonth.setMonth(new Date().getMonth() - 3); fourPastlastMonth.setMonth(new Date().getMonth() - 4); fivePastlastMonth.setMonth(new Date().getMonth() - 5);
    sixPastlastMonth.setMonth(new Date().getMonth() - 6); sevenPastlastMonth.setMonth(new Date().getMonth() - 7); eightPastlastMonth.setMonth(new Date().getMonth() - 8);
    ninePastlastMonth.setMonth(new Date().getMonth() - 9); tenPastlastMonth.setMonth(new Date().getMonth() - 10); elevenPastlastMonth.setMonth(new Date().getMonth() - 11);
    lastMonth.setDate(1); onePastlastMonth.setDate(1); twoPastlastMonth.setDate(1); elevenPastlastMonth.setDate(1); threePastlastMonth.setDate(1); fourPastlastMonth.setDate(1);
    fivePastlastMonth.setDate(1); sixPastlastMonth.setDate(1); sevenPastlastMonth.setDate(1); eightPastlastMonth.setDate(1); ninePastlastMonth.setDate(1); tenPastlastMonth.setDate(1);

    var options = {
        chart: {
            height: 240,
            type: "line",
            zoom: {
                enabled: !1
            }
            ,
            toolbar: {
                show: !1
            }
        }
        ,
        dataLabels: {
            enabled: !1
        }
        ,
        stroke: {
            width: 3, curve: "smooth", dashArray: [0, 8]
        }
        ,
        series: [
            {
                name: "Customers", type: "area", data: [dect, novt, octt, septt, augt, julyt, junet, mayt, aprt, mart, febt, jant]
            }
        ],
        colors: ["#3dc7be"],
        fill: {
            opacity: [.15]
        }
        ,
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        }
        ,
        xaxis: {
            categories: [getMonth(elevenPastlastMonth.getMonth()), getMonth(tenPastlastMonth.getMonth()), getMonth(ninePastlastMonth.getMonth()), getMonth(eightPastlastMonth.getMonth()), getMonth(sevenPastlastMonth.getMonth()), getMonth(sixPastlastMonth.getMonth()), getMonth(fivePastlastMonth.getMonth()), getMonth(fourPastlastMonth.getMonth()), getMonth(threePastlastMonth.getMonth()), getMonth(twoPastlastMonth.getMonth()), getMonth(onePastlastMonth.getMonth()), getMonth(lastMonth.getMonth())],
            labels: {
                style: {
                    colors: '#9aa0ac',
                }
            },
        },
        yaxis: {
            labels: {
                style: {
                    color: '#9aa0ac',
                }
            }
        },
        grid: {
            borderColor: "#f1f1f1"
        }
    };

    var chart = new ApexCharts(document.querySelector("#user_registration"), options);

    chart.render();
}

async function ShowEventChart() {

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var sevendays = new Date();
    sevendays.setDate(sevendays.getDate() + 7);

    var collectionRef = collection(db, "Events");
    var q = query(collectionRef, where("date", ">", yesterday), where("date", "<", sevendays));
    var monv = 0, tuesv = 0, wedv = 0, thursv = 0, friv = 0, satv = 0, sunv = 0;
    getDocs(q).then(function (querySnapshot) {
        if (querySnapshot.size > 0) {

            var yesterday = new Date();
            var onetomorrow = new Date();
            var twotomorrow = new Date();
            var threetomorrow = new Date();
            var fourtomorrow = new Date();
            var fivetomorrow = new Date();
            var sixtomorrow = new Date();
            onetomorrow.setDate(new Date().getDate() + 1);
            twotomorrow.setDate(new Date().getDate() + 2);
            threetomorrow.setDate(new Date().getDate() + 3);
            fourtomorrow.setDate(new Date().getDate() + 4);
            fivetomorrow.setDate(new Date().getDate() + 5);
            sixtomorrow.setDate(new Date().getDate() + 6);

            querySnapshot.forEach(function (docSnapshot) {
                var data = docSnapshot.data()
                if (data.admin) {

                }
                else {
                    var timestamp = data.date.toDate();
                    console.log("timestamp", timestamp)
                    switch (timestamp.getDate()) {
                        case yesterday.getDate():
                            monv++;
                            break;
                        case onetomorrow.getDate():
                            tuesv++;
                            break;
                        case twotomorrow.getDate():
                            wedv++;
                            break;
                        case threetomorrow.getDate():
                            thursv++;
                            break;
                        case fourtomorrow.getDate():
                            friv++;
                            break;
                        case fivetomorrow.getDate():
                            satv++;
                            break;
                        case sixtomorrow.getDate():
                            sunv++;
                            break;
                    }
                }

            })
        }
        else {
            console.log("No Data");
        }
        UpdateChart2(monv, tuesv, wedv, thursv, friv, satv, sunv)
    })
}

function UpdateChart2(monv, tuesv, wedv, thursv, friv, satv, sunv) {

    var yesterday = new Date();
            var onetomorrow = new Date();
            var twotomorrow = new Date();
            var threetomorrow = new Date();
            var fourtomorrow = new Date();
            var fivetomorrow = new Date();
            var sixtomorrow = new Date();
            onetomorrow.setDate(new Date().getDate() + 1);
            twotomorrow.setDate(new Date().getDate() + 2);
            threetomorrow.setDate(new Date().getDate() + 3);
            fourtomorrow.setDate(new Date().getDate() + 4);
            fivetomorrow.setDate(new Date().getDate() + 5);
            sixtomorrow.setDate(new Date().getDate() + 6);

    var options = {
        chart: {
            height: 240,
            type: "line",
            zoom: {
                enabled: !1
            }
            ,
            toolbar: {
                show: !1
            }
        }
        ,
        dataLabels: {
            enabled: !1
        }
        ,
        stroke: {
            width: 3, curve: "smooth", dashArray: [0, 8]
        }
        ,
        series: [
            {
                name: "Events", type: "area", 
                data: [monv, tuesv, wedv, thursv, friv, satv, sunv]
            }
        ],
        colors: ["#bd8878"],
        fill: {
            opacity: [.15]
        }
        ,
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        }
        ,
        xaxis: {
            categories: [getDay(yesterday.getDay()), getDay(onetomorrow.getDay()), getDay(twotomorrow.getDay()), getDay(threetomorrow.getDay()), getDay(fourtomorrow.getDay()), getDay(fivetomorrow.getDay()), getDay(sixtomorrow.getDay())],
            labels: {
                style: {
                    colors: '#9aa0ac',
                }
            },
        },
        yaxis: {
            labels: {
                style: {
                    color: '#9aa0ac',
                }
            }
        },
        grid: {
            borderColor: "#f1f1f1"
        }
    };

    var chart = new ApexCharts(document.querySelector("#upcoming_events"), options);

    chart.render();
}