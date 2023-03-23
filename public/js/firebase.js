// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import * as fbstorage from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";
import * as fbfirestore from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

var firebaseConfig = {
  apiKey: "AIzaSyDX9EI00irVMQh0xxuSApOiUCOuzIFuREY",
  authDomain: "checkaspnet-1115f.firebaseapp.com",
  databaseURL: "https://checkaspnet-1115f.firebaseio.com",
  projectId: "checkaspnet-1115f",
  storageBucket: "checkaspnet-1115f.appspot.com",
  messagingSenderId: "971083133588",
  appId: "1:971083133588:web:1fa14c5ce3078d6414ba81",
  measurementId: "G-E6ELJJ0L5K",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let auth = fbauth;
export let db = fbfirestore.getFirestore(app);
export let doc = fbfirestore.doc;
export let getDoc = fbfirestore.getDoc;
export let storage = fbstorage;
export let getDocs = fbfirestore.getDocs;
export let query = fbfirestore.query;
export let where = fbfirestore.where;
export let orderBy = fbfirestore.orderBy;
export let setdoc = fbfirestore.setDoc;
export let timestamp = fbfirestore.Timestamp;
export let collection = fbfirestore.collection;
export let addDoc = fbfirestore.addDoc;
export let setDoc = fbfirestore.setDoc;
export let updateDoc = fbfirestore.updateDoc;
export let deleteDoc = fbfirestore.deleteDoc;
export let serverTimestamp = fbfirestore.serverTimestamp;
export let onSnapshot = fbfirestore.onSnapshot;
export let limit = fbfirestore.limit;
