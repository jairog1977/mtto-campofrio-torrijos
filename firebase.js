import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
@@ -21,69 +22,18 @@
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;

/* ==========================
   PRUEBA DE ESCRITURA
========================== */

window.testFirebase = async function(){

    const pruebaRef =
        collection(db, "pruebas");

    await addDoc(pruebaRef, {
        texto: "Firebase conectado correctamente",
        fecha: new Date().toISOString()
    });

    alert("✅ Documento guardado en Firestore");

};

/* ==========================
   PRUEBA DE LECTURA
========================== */

window.readFirestore = async function(){

    const snapshot =
        await getDocs(
            collection(db,"trabajos")
        );

    let resultado = "";

    snapshot.forEach(documento => {

        const data = documento.data();

        resultado +=
            (data.Tecnico || "") +
            " | " +
            (data.Titulo || "") +
            " | " +
            (data.Estado || "") +
            "\n";

    });

    alert(
        resultado || "No hay trabajos"
    );

};

/* ==========================
   GUARDAR TRABAJO
========================== */
/* GUARDAR TRABAJO */

window.saveTrabajoFirebase =
async function(
@@ -109,21 +59,29 @@

};

/* LEER TRABAJOS POR TECNICO */

window.getTrabajosTecnico =
async function(tecnico){

    const snapshot =
        await getDocs(
            collection(db,"trabajos")
            collection(
                db,
                "trabajos"
            )
        );

    let trabajos = [];

    snapshot.forEach(documento => {

        const data = documento.data();
        const data =
            documento.data();

        if(data.Tecnico === tecnico){
        if(
            data.Tecnico === tecnico
        ){

            trabajos.push(data);

@@ -135,5 +93,58 @@

};

console.log("firebase version nueva");
alert("Firebase v2 cargado");
/* FINALIZAR TRABAJO */

window.finalizarTrabajoFirebase =
async function(
    tecnico,
    titulo
){

    const snapshot =
        await getDocs(
            collection(
                db,
                "trabajos"
            )
        );

    snapshot.forEach(
        async documento => {

            const data =
                documento.data();

            if(
                data.Tecnico === tecnico &&
                data.Titulo === titulo
            ){

                await updateDoc(
                    doc(
                        db,
                        "trabajos",
                        documento.id
                    ),
                    {
                        Estado:
                            "Finalizada",

                        FechaFin:
                            new Date()
                                .toLocaleString(
                                    "es-ES"
                                )
                    }
                );

            }

        }
    );

};

console.log(
    "Firebase cargado correctamente"
);
