const PASS="Adm13309";let admin=false,currentTech=null,currentDep=null;let previewFiles=[];let open={Loncheado:true,Transformacion:false};const KEY='campofrio_v3';let db=JSON.parse(localStorage.getItem(KEY)||'null')||{departamentos:{Loncheado:["Jorge","Cesar","Alejandro","Danny","Alberto","Dorel","Manuel","Enrique","Javi"],Transformacion:["Carlos","Jose Maria","J.C.Rivera","Igor","J.C.Rodriguez","Antonio","Othman","Jhonny","David","Jaime"]},trabajos:{}};function save(){localStorage.setItem(KEY,JSON.stringify(db));}
function drawMenu(){let h='';for(let d in db.departamentos){h+=`<button onclick="toggleDept('${d}')">📂 ${d}</button>`;if(open[d]) db.departamentos[d].forEach(t=>h+=`<button class="sub" onclick="openTech('${d}','${t}')">${t}</button>`);}document.getElementById('menu').innerHTML=h;document.getElementById('adminBtn').textContent=admin?'🚪 Salir Gestión':'🔐 Gestión';}
function toggleDept(d){open[d]=!open[d];drawMenu();}
function home(){let p=0,f=0;Object.values(db.trabajos).forEach(a=>a.forEach(t=>t.estado==='Finalizada'?f++:p++));document.getElementById('content').innerHTML=`<div class='card'><h1>Mtto. Campofrio Torrijos</h1><p>Seleccione un técnico en Loncheado o Transformación.</p><p>🔴 Pendientes: ${p}</p><p>✅ Finalizadas: ${f}</p></div>`;}
async function openTech(dep,tec){currentTech=tec;currentDep=dep;const tareas=db.trabajos[tec]||[];let p=tareas.filter(x=>x.estado==='Pendiente').length,f=tareas.filter(x=>x.estado==='Finalizada').length;let h=`<h1>${tec}</h1><div class='card'><b>Departamento:</b> ${dep}<br><br>📋 Total trabajos: ${tareas.length}<br>🔴 Pendientes: ${p}<br>✅ Finalizadas: ${f}</div>`;tareas.forEach((t,i)=>{h+=`<div class='card ${t.estado==='Finalizada'?'fin':'pend'}'><h2>${t.titulo}</h2><p>${t.desc}</p><p><b>Estado:</b> ${t.estado}</p><p><b>Prioridad:</b> ${t.prioridad}</p>`;if(t.fechaFin)h+=`<p><b>Finalizada:</b> ${t.fechaFin}</p>`;(t.adjuntos||[]).forEach(a=>{if((a.tipo||'').startsWith('image/'))h+=`<img class='thumb' src='${a.data}'>`;});if(t.estado==='Pendiente')h+=`<button onclick="finishTask(${i})">✅ Marcar como finalizada</button>`;if(admin)h+=` <button class='danger' onclick="delTask(${i})">🗑️ Eliminar</button>`;h+='</div>';});if(admin){h+=`<div class='card'><h3>Nuevo trabajo</h3><input id='tit' placeholder='Título'><textarea id='des' placeholder='Descripción'></textarea><select id='pri'><option>Alta</option><option>Media</option><option>Baja</option></select><input type='file' id='files' multiple accept='image/*'><div id='preview' class='preview'></div><button onclick='saveTask()'>Guardar trabajo</button></div>`;}document.getElementById('content').innerHTML=h;if(admin){document.getElementById('files').addEventListener('change',previewSelected);}}
function previewSelected(e){previewFiles=[];let box=document.getElementById('preview');box.innerHTML='<h4>Vista previa</h4>';[...e.target.files].forEach((f,idx)=>{let r=new FileReader();r.onload=v=>{previewFiles.push({nombre:f.name,tipo:f.type,data:v.target.result});renderPreview();};r.readAsDataURL(f);});}
function renderPreview(){let box=document.getElementById('preview');box.innerHTML='<h4>Vista previa</h4>';previewFiles.forEach((f,i)=>{box.innerHTML+=`<div><img src='${f.data}' width='90'> <button type='button' onclick='removePreview(${i})'>🗑️ Quitar</button></div>`;});}
function removePreview(i){previewFiles.splice(i,1);renderPreview();}
async function saveTask(){

    if(!db.trabajos[currentTech]){
        db.trabajos[currentTech]=[];
    }

    db.trabajos[currentTech].unshift({

        titulo: tit.value,
        desc: des.value,
        prioridad: pri.value,
        estado: 'Pendiente',
        adjuntos: previewFiles

    });

    previewFiles=[];

    save();

    try{

        await saveTrabajoFirebase(

            currentTech,

            tit.value,

            des.value

        );

        console.log(
            "Trabajo guardado en Firebase"
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

}function delTask(i){db.trabajos[currentTech].splice(i,1);save();openTech(currentDep,currentTech);}document.getElementById('adminBtn').onclick=()=>{if(admin){admin=false;drawMenu();home();return;}if(prompt('Contraseña')===PASS){admin=true;drawMenu();home();}};drawMenu();home();