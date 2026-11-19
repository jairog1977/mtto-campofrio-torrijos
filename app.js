const PASS="Adm13309";

let admin=false;
let currentTech=null;
let currentDep=null;
let previewFiles=[];

let open={
    Loncheado:true,
    Transformacion:false
};

const KEY="campofrio_v31";

let db=JSON.parse(localStorage.getItem(KEY)||'null')||{
    tecnicos:{Jorge:{telefono:''},Cesar:{telefono:''},Alejandro:{telefono:''},Danny:{telefono:''},Alberto:{telefono:''},Dorel:{telefono:''},Manuel:{telefono:''},Enrique:{telefono:''},Javi:{telefono:''},Carlos:{telefono:''},'Jose Maria':{telefono:''},'J.C.Rivera':{telefono:''},Igor:{telefono:''},'J.C.Rodriguez':{telefono:''},Antonio:{telefono:''},Othman:{telefono:''},Jhonny:{telefono:''},David:{telefono:''},Jaime:{telefono:''}},
    departamentos:{Loncheado:['Jorge','Cesar','Alejandro','Danny','Alberto','Dorel','Manuel','Enrique','Javi'],Transformacion:['Carlos','Jose Maria','J.C.Rivera','Igor','J.C.Rodriguez','Antonio','Othman','Jhonny','David','Jaime']},
    trabajos:{}
};
function save(){localStorage.setItem(KEY,JSON.stringify(db));}
function draw(){let h='';for(let d in db.departamentos){h+=`<button onclick="tog('${d}')">📂 ${d}</button>`;if(open[d])db.departamentos[d].forEach(t=>h+=`<button class=sub onclick="openTech('${d}','${t}')">${t}</button>`);}menu.innerHTML=h;adminBtn.textContent=admin?'🚪 Salir Gestión':'🔐 Gestión';}
function tog(d){open[d]=!open[d];draw();}
function home(){content.innerHTML='<div class=card><h1>Mtto. Campofrio Torrijos</h1><p>Seleccione un técnico en Loncheado o Transformación.</p></div>';}
async function openTech(dep,tec){currentTech=tec;currentDep=dep;let tel=(db.tecnicos[tec]||{}).telefono||'';let tareas = [];

try{

    tareas = await getTrabajosTecnico(
        tec
    );

}catch(error){

    console.error(
        "Error cargando Firestore:",
        error
    );

    tareas =
        db.trabajos[tec] || [];

}let h=`<h1>${tec}</h1><div class=card><b>Departamento:</b> ${dep}<br>📱 ${tel||'Sin teléfono'}`;if(tel&&admin){h+=`<br><button onclick="sendWhatsapp()">💬 WhatsApp</button>`;}h+='</div>';tareas.forEach((t,i)=>{

    const estadoActual =
        t.Estado || t.estado;

    console.log(
        "Estado tarea:",
        estadoActual,
        t
    );

    h+=`
    <div class='card ${
        estadoActual === 'Finalizada'
            ? 'fin'
            : 'pend'
    }'>

    <h3>
        ${t.Titulo || t.titulo}
    </h3>

    <p>
        ${t.Descripcion || t.desc || ''}
    </p>

    <p>
        ${estadoActual}
    </p>
    `;

    if(t.fechaFin)
        h += '<p>' + t.fechaFin + '</p>';

    (t.adjuntos || []).forEach(a =>
        h += `<img class=thumb src='${a.data}'>`
    );

    if(estadoActual === "Pendiente"){

        h += `
        <button onclick='finish(${i})'>
            ✅ Marcar como finalizada
        </button>`;

    }

    h += '</div>';

});

if(admin)
    h+=` <button onclick='deleteTask(${i})'>
            🗑️ Eliminar tarea
        </button>`;h+='</div>'});if(admin){h+=`<div class=card><input id=tel placeholder='Telefono tecnico' value='${tel}'><button onclick='savePhone()'>Guardar teléfono</button></div><div class=card><input id=tit placeholder='Título'><textarea id=des placeholder='Descripción'></textarea><input type=file id=files multiple accept='image/*'><div id=preview></div><button onclick='saveTask()'>Guardar trabajo</button></div>`;}content.innerHTML=h;if(admin){files.onchange=previewSel;}}
function savePhone(){db.tecnicos[currentTech]={telefono:tel.value};save();openTech(currentDep,currentTech);}function previewSel(e){previewFiles=[];[...e.target.files].forEach(f=>{let r=new FileReader();r.onload=v=>{previewFiles.push({data:v.target.result});renderPrev();};r.readAsDataURL(f);});}
function renderPrev(){preview.innerHTML='<h4>Vista previa</h4>';previewFiles.forEach((f,i)=>preview.innerHTML+=`<div><img width=80 src='${f.data}'> <button onclick='removePrev(${i})'>🗑️ Quitar</button></div>`);}function removePrev(i){previewFiles.splice(i,1);renderPrev();}
function saveTask(){if(!db.trabajos[currentTech])db.trabajos[currentTech]=[];db.trabajos[currentTech].unshift({titulo:tit.value,desc:des.value,estado:'Pendiente',adjuntos:previewFiles});save();openTech(currentDep,currentTech);}async function finish(i){

    let t =
        db.trabajos[currentTech][i];

    t.estado =
        "Finalizada";

    t.fechaFin =
        new Date()
            .toLocaleString("es-ES");

    save();

    try{

        await finalizarTrabajoFirebase(
            currentTech,
            t.Titulo || t.titulo
        );

        console.log(
            "Trabajo finalizado en Firebase"
        );

    }catch(error){

        console.error(
            "Error Firebase:",
            error
        );

    }

    openTech(
        currentDep,
        currentTech
    );

}
function sendWhatsapp(){const telefono=(db.tecnicos[currentTech]||{}).telefono||'';if(!telefono){alert('El técnico no tiene teléfono asignado');return;}const tareas=db.trabajos[currentTech]||[];if(tareas.length===0){alert('No hay tareas asignadas');return;}const tarea=tareas[0];const mensaje=`🏭 MTTO. CAMPOFRIO TORRIJOS\n\nNueva tarea asignada\n\nTécnico: ${currentTech}\n\nTítulo:\n${tarea.titulo}\n\nDescripción:\n${tarea.desc}\n\nPor favor revise la aplicación.`;const url='https://wa.me/34'+telefono.replace(/\D/g,'')+'?text='+encodeURIComponent(mensaje);window.open(url,'_blank');}
function sendWhatsapp(){

    const telefono =
        (db.tecnicos[currentTech] || {}).telefono || '';

    if(!telefono){
        alert('El técnico no tiene teléfono asignado');
        return;
    }

    const tareas =
        db.trabajos[currentTech] || [];

    if(tareas.length === 0){
        alert('No hay tareas asignadas');
        return;
    }

    const tarea = tareas[0];

    const mensaje =
`🏭 MTTO. CAMPOFRIO TORRIJOS

Nueva tarea asignada

Técnico: ${currentTech}

Título:
${tarea.titulo}

Descripción:
${tarea.desc}

Por favor revise la aplicación.`;

    const url =
        'https://wa.me/34' +
        telefono.replace(/\\D/g,'') +
        '?text=' +
        encodeURIComponent(mensaje);

    window.open(url,'_blank');
}
function deleteTask(index){

    if(
        !confirm(
            "¿Deseas eliminar esta tarea?"
        )
    ){
        return;
    }

    if(
        !db.trabajos[currentTech]
    ){
        return;
    }

    db.trabajos[currentTech].splice(
        index,
        1
    );

    save();

    openTech(
        currentDep,
        currentTech
    );

}
adminBtn.onclick=()=>{if(admin){admin=false;draw();home();return;}if(prompt('Contraseña')===PASS){admin=true;draw();home();}};draw();home();