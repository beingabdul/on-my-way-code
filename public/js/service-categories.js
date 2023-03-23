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
  getServiceCategories();
});
function getServiceCategories() {
  var collectionRef = collection(db, "services_categories");
  var q = query(collectionRef, orderBy("created_at", "desc"));
  try {
    getDocs(q)
      .then(function (querySnapshot) {
        $("#DataTable").DataTable().destroy();
        $("#catData").html("");
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(function (doc) {
            var data = doc.data();
            var maximum_cars_per_order = data.maximum_cars_per_order;
            var status = data.active;
            var image_url = data.image_url;
            var name = data.name;
            var minimum_order_price = data.minimum_order_price;
            var created_at = data.created_at.toDate().toString().substr(0, 15);
            var order = data.order;
            var starting_price = data.starting_price;
            var doc_id = data.doc_id;
            var isCommingSoon = data.toggle_soon == true ? `Yes` : `No`;
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
                          <a
                            class="image-popup-vertical-fit"
                            href="${image_url}"
                          >
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
                        <div class="userDatatable-content d-flex">${name}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">
                          <span
                            class="media-badge text-uppercase color-white bg-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-sp"
                            >Show Services</span
                          >
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${starting_price}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${minimum_order_price}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${maximum_cars_per_order}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${isCommingSoon}</div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">${order}</div>
                      </td>
                      <td>
                        ${statusTag}
                      </td>
                      <td>
                        <ul
                          class="orderDatatable_actions mb-0 d-flex flex-wrap"
                        >
                        ${statusBtn}
                          <li>
                            <a href="#" class="view">
                              <i class="uil uil-setting"></i>
                            </a>
                          </li>
                        </ul>
                      </td>
                    </tr>`;
            $("#catData").append(row);
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
function toggleStausToActive(doc_id) {
  const catRef = collection(db, "services_categories");
  Swal.fire({
    icon: "question",
    title: "Mark Active",
    text: "Do you want to mark category as Active?",
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
        getServiceCategories();
      }
    },
  });
}
function toggleStausToBlocked(doc_id) {
  const catRef = collection(db, "services_categories");
  Swal.fire({
    icon: "question",
    title: "Mark Blocked",
    text: "Do you want to mark category as Blocked?",
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
        getServiceCategories();
      }
    },
  });
}
$("input").click(() => {
  $('input[name="categoryName"]').removeClass("is-invalid");
  $('input[name="startingPrice"]').removeClass("is-invalid");
  $('input[name="minimumOrderprice"]').removeClass("is-invalid");
  $('input[name="maximumCarsOrder"]').removeClass("is-invalid");
  $('input[name="categoryName"]').removeClass("is-invalid");
  $(".custom-file-container__custom-file__custom-file-control").css(
    "border-color",
    "#f1f2f3"
  );
});
function validateCategory() {
  var file = document.getElementById("file").files;
  var cat_name = $('input[name="categoryName"]').val();
  var max_cars = $('input[name="maximumCarsOrder"]').val();
  var min_ord_price = $('input[name="minimumOrderprice"]').val();
  var starting_price = $('input[name="startingPrice"]').val();
  var toggle_soon = $('input[name="isCommingSoon"]')[0].checked;
  let validated = true;
  if (cat_name == "") {
    validated = false;
    $('input[name="categoryName"]').addClass("is-invalid");
  }
  if (starting_price == "") {
    validated = false;
    $('input[name="startingPrice"]').addClass("is-invalid");
  }
  if (min_ord_price == "") {
    validated = false;
    $('input[name="minimumOrderprice"]').addClass("is-invalid");
  }
  if (max_cars == "") {
    validated = false;
    $('input[name="maximumCarsOrder"]').addClass("is-invalid");
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
      "/servicecategoryimages/" + name
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
            addCategoryAsync(
              downloadURL,
              cat_name,
              max_cars,
              min_ord_price,
              starting_price,
              toggle_soon
            );
          });
      }
    );
  }
}
async function addCategoryAsync(
  image,
  cat_name,
  max,
  min,
  starting_price,
  toggle_soon
) {
  const catRef = collection(db, "services_categories");
  var docRef = query(catRef, orderBy("services_categories", "desc"), limit(1));
  const docSnap = await getDocs(docRef);
  let order = 0;
  if (docSnap.size > 0) {
    order = docSnap.docs[0].data().order;
  }
  let doc_id = new Date().getTime().toString();
  await setDoc(doc(catRef, doc_id), {
    active: true,
    created_at: new Date(),
    image_url: image,
    maximum_cars_per_order: parseInt(max),
    minimum_order_price: parseInt(min),
    name: cat_name,
    starting_price: parseInt(starting_price),
    toggle_soon: toggle_soon,
    doc_id: doc_id,
    order: order,
  });
  $("#modal-ag").modal("hide");
  window.location.reload;
}
function clearModal() {
  $('input[name="categoryName"]').val("");
  $('input[name="startingPrice"]').val("1");
  $('input[name="minimumOrderprice"]').val("1");
  $('input[name="maximumCarsOrder"]').val("1");
  $('input[name="isCommingSoon"]')[0].checked = false;
  $(".custom-file-container__custom-file__custom-file-control").css(
    "border-color",
    "#f1f2f3"
  );
}
