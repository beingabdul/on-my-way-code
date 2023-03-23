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
var deleteDoc;
var setDoc;
var onSnapshot;
var realdb;
var ref;
var get;
var child;
var onValue;
var runTransaction;
var storage;
var limit;
$(async function () {
  await import("./firebase.js").then(function (exports) {
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
  setDoc = exportData.setDoc;
  deleteDoc = exportData.deleteDoc;
  onSnapshot = exportData.onSnapshot;
  storage = exportData.storage;
  limit = exportData.limit;
  getServices();
  getServiceCategories();
});
async function getServices() {
  var collectionRef = collection(db, "car_services");
  var q = query(collectionRef, orderBy("created_at", "desc"));
  try {
    getDocs(q)
      .then(function (querySnapshot) {
        $("#DataTable").DataTable().destroy();
        $("#serviceData").html("");
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(async function (doc) {
            var data = doc.data();
            var service_order = data.service_order;
            var description = data.description;
            var status = data.active;
            var image_url = data.image_url;
            var service_name = data.service_name;
            var service_time_in_mins = data.service_time_in_mins;
            var created_at = data.created_at.toDate().toString().substr(0, 15);
            var price = data.price;
            var doc_id = data.doc_id;
            localStorage.setItem(doc_id, description);
            var category_id = data.services_category_id;
            var allowQty = data.qty_allowed == true ? `Yes` : `No`;
            var statusTag = `<span class="media-badge text-uppercase color-white bg-danger">Blocked</span>`;
            var statusBtn = `<li>
                            <a
                               onclick="toggleStausToActive('${doc_id}')"
                              href="#"
                              class="view"
                            >
                              <i class="uil uil-check"></i>
                            </a>
                          </li>`;
            if (status) {
              statusTag = `<span class="media-badge text-uppercase color-white bg-success">Active</span>`;
              statusBtn = `<li>
                            <a
                              onclick="toggleStausToBlocked('${doc_id}')"
                              href="#"
                              class="view"
                            >
                              <i class="uil uil-ban"></i>
                            </a>
                          </li>`;
            }

            var row = `<tr>
                      <td>
                        <div class="image-link">
                          <a class="image-popup-vertical-fit" href="${image_url}">
                            <img
                              class="img-responsive thumbnail"
                              src="${image_url}"
                              width="35"
                              height="30"
                            />
                          </a>
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">
                          ${service_name}
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex" data-cat="${category_id}"></div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${price}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${allowQty}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">
                          <span
                          onclick=showDescripteion(this,${doc_id})
                            class="btn media-badge text-uppercase color-white bg-primary"
                            >Show Description</span
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${service_order}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${service_time_in_mins}</div>
                      </td>
                      <td>
                        ${statusTag}
                      </td>
                      <td>
                        <ul
                          class="orderDatatable_actions mb-0 d-flex flex-wrap"
                        >
                          <li>
                            <a href="#" class="view">
                              <i class="uil uil-edit"></i>
                            </a>
                          </li>
                          ${statusBtn}
                        </ul>
                      </td>
                    </tr>`;
            $("#serviceData").append(row);
            await getCatName(category_id);
          });
        } else {
          MixinSweet("No data!", "There is no data to show", "info", 2000);
        }
      })
      .then(() => {
        $('[data-toggle="tooltip"]').tooltip();
        $("#DataTable").DataTable();
      });
  } catch (ex) {
    console.log(ex);
  }
}
async function getCatName(id) {
  const docRef = doc(db, "services_categories", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists() > 0) {
    cat_name = docSnap.data().name;
    $("#serviceData")
      .find('[data-cat="' + id + '"]')
      .html(cat_name);
  }
}
function toggleStausToActive(doc_id) {
  const catRef = collection(db, "car_services");
  Swal.fire({
    icon: "question",
    title: "Mark Active",
    text: "Do you want to mark service as Active?",
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async (response) => {
      console.log(response);
      if (response == true) {
        await updateDoc(doc(catRef, doc_id), {
          active: true,
        });
        TimerSweet("Marked Active Successfully", "", "success", 2000);
        getServices();
      }
    },
  });
}
function toggleStausToBlocked(doc_id) {
  const catRef = collection(db, "car_services");
  Swal.fire({
    icon: "question",
    title: "Mark Blocked",
    text: "Do you want to mark service as Blocked?",
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async (response) => {
      console.log(response);
      if (response == true) {
        await updateDoc(doc(catRef, doc_id), {
          active: false,
        });
        TimerSweet("Marked Blocked Successfully", "", "success", 2000);
        getServices();
      }
    },
  });
}
$("input").click(() => {
  $(".editor").removeClass("is-invalid");
  $('input[name="serviceName"]').removeClass("is-invalid");
  $('input[name="price"]').removeClass("is-invalid");
  $('input[name="serviceTime"]').removeClass("is-invalid");
  $("#allowQty").removeClass("is-invalid");
  $(".select2-selection--single").css("border-color", "#f1f2f3");
  $(".custom-file-container__custom-file__custom-file-control").css(
    "border-color",
    "#f1f2f3"
  );
});
async function validateService() {
  var service_name = $('input[name="serviceName"]').val();
  var price = $('input[name="price"]').val();
  var service_time = $('input[name="serviceTime"]').val();
  var qty_allowed = $("#allowQty").val();
  var service_category = $("#serviceCategory").val();
  var file = document.getElementById("file").files;
  var description = $(".ql-editor").html();
  let validated = true;
  debugger;
  if (service_name == "") {
    validated = false;
    $('input[name="serviceName"]').addClass("is-invalid");
  }
  if (price == "") {
    validated = false;
    $('input[name="price"]').addClass("is-invalid");
  }
  if (service_time == "") {
    validated = false;
    $('input[name="serviceTime"]').addClass("is-invalid");
  }
  if (service_category == null) {
    validated = false;
    $(".select2-selection--single").css("border-color", "red");
  }
  if (file.length == 0) {
    validated = false;
    $(".custom-file-container__custom-file__custom-file-control").css(
      "border-color",
      "red"
    );
  }
  if (validated) {
    $("#save_btn").css("pointer-events", "none");
    var file = $("#file").get(0).files[0];
    var name = new Date().getTime().toString() + "-" + file.name;
    var storageRef = storage;
    var ref = storageRef.ref(
      storageRef.getStorage(),
      "/servicesimages/" + name
    );
    var uploadTask = storageRef.uploadBytesResumable(ref, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        $("#save_btn").css("pointer-events", "all");
        sweetMessage("Warning", error.message, "error");
      },
      () => {
        storageRef
          .getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            addServiceAsync(
              downloadURL,
              service_name,
              service_category,
              service_time,
              price,
              qty_allowed,
              description
            );
          });
      }
    );
  }
}
async function addServiceAsync(
  image,
  service_name,
  service_category,
  service_time,
  price,
  qty_allowed,
  description
) {
  var collectionRef = collection(db, "car_services");
  var docRef = query(collectionRef, orderBy("service_order", "desc"), limit(1));
  const docSnap = await getDocs(docRef);
  let service_order = 0;
  if (docSnap.size > 0) {
    service_order = docSnap.docs[0].data().service_order;
  }
  let doc_id = new Date().getTime().toString();
  await setDoc(doc(collectionRef, doc_id), {
    active: true,
    blocked: false,
    created_at: new Date(),
    image_url: image,
    icon: image,
    description: description,
    price: parseInt(price),
    service_name: service_name,
    service_order: service_order + 1,
    qty_allowed: qty_allowed == "true" ? true : false,
    doc_id: doc_id,
    key: doc_id,
    service_time_in_mins: parseInt(service_time),
    services_category_id: service_category,
  });
  $("#modal-ag").modal("hide");
  window.location.reload();
}
function clearModal() {
  $(".editor").val("");
  $('input[name="price"]').val("1");
  $('input[name="serviceTime"]').val("1");
  $("#allowQty").val("1");
  $("#allowQty")[0].checked = false;
  $(".custom-file-container__custom-file__custom-file-control").css(
    "border-color",
    "#f1f2f3"
  );
}
function getServiceCategories() {
  var collectionRef = collection(db, "services_categories");
  var q = query(collectionRef, orderBy("created_at", "desc"));
  try {
    getDocs(q)
      .then(function (querySnapshot) {
        $("#serviceCategory").html(
          `<option value="000" disabled selected>-- Select Category --</option>`
        );
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(function (doc) {
            var data = doc.data();
            var name = data.name;
            var doc_id = data.doc_id;
            $("#serviceCategory").append(
              `<option value="${doc_id}">${name}</option>`
            );
          });
        }
      })
      .then(() => {
        $("#serviceCategory").select2();
      });
  } catch (ex) {
    console.log(ex);
  }
}
function showDescripteion(btn, id) {
  $("#service_description").html(localStorage.getItem(id));
  $("#modal-description").modal("show");
}
