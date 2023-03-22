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
  createUsers();
});
function createUsers() {
  var collectionRef = collection(db, "users");
  var filterRole = where("role", "==", "customer");
  var filterDelete = where("is_deleted", "==", false);
  var q = query(
    collectionRef,
    filterRole,
    filterDelete,
    orderBy("created_at", "desc")
  );
  try {
    getDocs(q)
      .then(function (querySnapshot) {
        $("#DataTable").DataTable().destroy();
        $("#usersData").html("");
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(function (doc) {
            var data = doc.data();
            var email = data.user_email;
            var status = data.blocked;
            var image_url = data.image_url;
            var name = data.name;
            var phone_number = data.phone_number;
            var created_at = data.created_at.toDate().toString().substr(0, 15);
            var user_name = data.user_name;
            var user_uid = data.user_uid;
            var cashBtn =
              data.cash_banned == true
                ? `onclick="allowCash('${user_uid}')"`
                : `onclick="banCash('${user_uid}')"`;
            var statusTag = `<span class="media-badge text-uppercase color-white bg-success">Active</span>`;
            var statusBtn = `<li>
                            <a
                              onclick="toggleStausToBlocked('${user_uid}')"
                              href="#"
                              class="view"
                            >
                              <i class="uil uil-ban"></i>
                            </a>
                          </li>`;
            if (status) {
              statusTag = `<span class="media-badge text-uppercase color-white bg-danger">Blocked</span>`;
              statusBtn = `<li>
                            <a
                               onclick="toggleStausToActive('${user_uid}')"
                              href="#"
                              class="view"
                            >
                              <i class="uil uil-check"></i>
                            </a>
                          </li>`;
            }

            var row = `<tr>
                      <td>
                        <div class="d-flex">
                          <div class="userDatatable-inline-title">
                            <a href="#" class="text-dark fw-500">
                              <h6>${name}</h6>
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content--subject">
                          ${email}
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">
                          ${created_at}
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">
                          ${phone_number}
                        </div>
                      </td>
                      <td>
                        <div class="userDatatable-content d-flex">
                            ${statusTag}
                        </div>
                      </td>
                      <td>
                        <ul
                          class="orderDatatable_actions mb-0 d-flex flex-wrap"
                        >
                         ${statusBtn}
                          <li>
                            <a
                             ${cashBtn}
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-basic"
                              class="view"
                            >
                              <i class="uil uil-setting"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              onclick="deleteUser("${user_uid}")"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-basic"
                              class="view"
                            >
                              <i class="uil uil-trash-alt"></i>
                            </a>
                          </li>
                        </ul>
                      </td>
                    </tr>`;
            $("#usersData").append(row);
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
  const userRef = collection(db, "users");
  Swal.fire({
    icon: "question",
    title: "Mark Active",
    text: "Do you want to mark user as Active?",
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async (response) => {
      console.log(response);
      if (response == true) {
        await updateDoc(doc(userRef, doc_id), {
          blocked: false,
        });
        TimerSweet("Marked Active Successfully", "", "success", 2000);
        createUsers();
      }
    },
  });
}

function toggleStausToBlocked(doc_id) {
  const userRef = collection(db, "users");
  Swal.fire({
    icon: "question",
    title: "Mark Blocked",
    text: "Do you want to mark user as Blocked?",
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async (response) => {
      console.log(response);
      if (response == true) {
        await updateDoc(doc(userRef, doc_id), {
          blocked: true,
        });
        TimerSweet("Marked Blocked Successfully", "", "success", 2000);
        createUsers();
      }
    },
  });
}

function allowCash(doc_id) {
  const userRef = collection(db, "users");
  Swal.fire({
    icon: "question",
    title: "Allow Cash",
    text: "Do you want to allow user cash?",
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async (response) => {
      console.log(response);
      if (response == true) {
        await updateDoc(doc(userRef, doc_id), {
          cash_banned: false,
        });
        TimerSweet("Cash Allowed Successfully", "", "success", 2000);
        createUsers();
      }
    },
  });
}
function banCash(doc_id) {
  const userRef = collection(db, "users");
  Swal.fire({
    icon: "question",
    title: "Restrict Cash",
    text: "Do you want to restrict user cash?",
    showConfirmButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async (response) => {
      console.log(response);
      if (response == true) {
        await updateDoc(doc(userRef, doc_id), {
          cash_banned: true,
        });
        TimerSweet("Cash Restricted Successfully", "", "success", 2000);
        createUsers();
      }
    },
  });
}
