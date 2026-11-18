import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNzYJtt646Ve_7I1tChjD5PkqfdqI6UcM",
  authDomain: "mtto-campofrio-torrijos.firebaseapp.com",
  projectId: "mtto-campofrio-torrijos",
  storageBucket: "mtto-campofrio-torrijos.firebasestorage.app",
  messagingSenderId: "450785079641",
  appId: "1:450785079641:web:8feb07fec3a22126f25c48"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.updateDoc = updateDoc;
window.doc = doc;
window.testFirebase = async function(){

    const pruebaRef =
        collection(db, "pruebas");

    await addDoc(pruebaRef, {
        texto: "Firebase conectado correctamente",
        fecha: new Date().toISOString()
    });

    alert("✅ Documento guardado en Firestore");

}