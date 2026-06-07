const U = "professor";
const P = "1234";

let alunos =
JSON.parse(localStorage.getItem("alunos")) || [];

let ocorrencias =
JSON.parse(localStorage.getItem("oc")) || [];

let agenda =
JSON.parse(
  localStorage.getItem("agenda")
) || [];

let chartObj;

/* LOGIN */

window.onload = function(){

  if(localStorage.getItem("login")){

    document.getElementById("login-page")
    .style.display = "none";

    document.getElementById("app")
    .style.display = "block";

    document.querySelector(".topbar")
    .style.display = "flex";

    atualizarHome();

    renderAlunos();

    renderOc();

    renderAgenda();
  } else{

    document.getElementById("app")
    .style.display = "none"

   }

};

function entrar(){

  const u =
  document.getElementById("l-user")
  .value.trim();

  const p =
  document.getElementById("l-pass")
  .value.trim();

  if(u === U && p === P){

    localStorage.setItem("login","1");

    document.getElementById("login-page")
    .style.display = "none";

    document.getElementById("app")
    .style.display = "block";

    atualizarHome();

    renderAlunos();

    renderOc();

  } else {

    alert("Usuário ou senha incorretos!");

  }

}

function sair(){

  localStorage.removeItem("login");

  document.getElementById("login-page")
  .style.display = "flex";
  
  document.getElementById("app")
  .style.display = "none";

}

/* NAVEGAÇÃO */

function irPara(id){

  document
  .querySelectorAll(".tela")
  .forEach(t => t.classList.remove("ativa"));

  document
  .getElementById(id)
  .classList.add("ativa");

  const topbar =
document.querySelector(".topbar");

if(id === "home"){

  topbar.style.display = "flex";

}else{

  topbar.style.display = "none";

}

  document
  .querySelectorAll(".nav-item")
  .forEach(n => n.classList.remove("active"));

  const mapa = {
    home:0,
    notas:1,
    grafico:2,
    oc:3,
    turmas:4,
    alunosTurma:4
  };

  document
  .querySelectorAll(".nav-item")
  [mapa[id]]
  .classList.add("active");

  if(id === "grafico"){
    renderGrafico();
  }

}

/* HOME */

function atualizarHome(){

  const total =
  document.getElementById("home-total");

  const oc =
  document.getElementById("home-oc");

  if(total){
    total.textContent = alunos.length;
  }

  if(oc){
    oc.textContent = ocorrencias.length;
  }

}

/* ALUNOS */

function editarAluno(indice){

  const novaNota = prompt(
    "Digite a nova nota:",
    alunos[indice].nota
  );

  if(novaNota === null) return;

  alunos[indice].nota =
  parseFloat(novaNota);

  salvar();

  renderAlunos();

}

function excluirAluno(indice){
    
  if(
    confirm(
      "Deseja realmente excluir este aluno?"
    )
  ){

    alunos.splice(indice,1);

    salvar();

    renderAlunos();

  }

}

function renderAlunos(){

  const tbody =
  document.getElementById("tbody");

  tbody.innerHTML = "";

  const filtro =
  document.getElementById("filtroTurma")?.value || "todos";

  let lista = alunos;

  if(filtro !== "todos"){
    lista = alunos.filter(
      aluno => aluno.serie === filtro
    );
  }

  lista.forEach((a,i)=>{

    const aprovado =
    a.nota >= 6;

    const tr =
    document.createElement("tr");

    tr.innerHTML = `
    <td>${i+1}</td>
  
    <td>${a.nome}</td>
  
    <td>${a.serie || "-"}</td>
  
    <td>${a.nota}</td>
  
    <td class="${
      aprovado
      ? 'aprovado'
      : 'reprovado'
    }">
      ${
        aprovado
        ? '✅ Aprovado'
        : '❌ Reprovado'
      }
    </td>
    <td>
    <button
      class="btn-editar"
      onclick="editarAluno(${i})"
    >
      ✏️
    </button>
  
    <button
      class="btn-excluir"
      onclick="excluirAluno(${i})"
    >
      🗑️
    </button>
  </td>
    `;

    tbody.appendChild(tr);

  });

}

function addAluno(){

  const nome =
  document.getElementById("nome")
  .value.trim();

  const serie =
  document.getElementById("serie")
  .value;

  const nota =
  parseFloat(
    document.getElementById("nota").value
  );

  if(!nome || !serie || isNaN(nota)){

    alert("Preencha todos os campos!");

    return;
  }

  alunos.push({
    nome,
    serie,
    nota
  });

  salvar();

  renderAlunos();

  document.getElementById("nome").value = "";
  document.getElementById("serie").value = "";
  document.getElementById("nota").value = "";

}

/* GRÁFICO */

function renderGrafico(turmaSelecionada = null){

  const canvas = turmaSelecionada
  ? document.getElementById("chartTurma")
  : document.getElementById("chartHome2");

  if(chartObj){
    chartObj.destroy();
  }

  let alunosGrafico = [];

  /* SE TIVER TURMA */
  if(turmaSelecionada){

    alunosGrafico =
    dadosTurmas[turmaSelecionada];

  }

  /* SENÃO USA TODOS */
  else{

    Object.values(dadosTurmas)
    .forEach(turma => {

      alunosGrafico.push(...turma);

    });

  }

  chartObj = new Chart(canvas,{

    type:"bar",

    data:{

      labels:
      alunosGrafico.map(a=>a.nome),

      datasets:[{

        label:"Notas da Turma",

        data:
        alunosGrafico.map(a=>a.nota),

        backgroundColor:
        alunosGrafico.map(a=>
          a.nota >= 6
          ? "rgba(255,255,255,0.7)"
          : "rgba(255,99,132,0.8)"
        ),

        borderRadius:8

      }]

    },

    options:{

      responsive:true,

      maintainAspectRatio:false,

      plugins:{

        legend:{
          display:false
        }

      },

      scales:{

        x:{
          ticks:{
            color:"#fff"
          },
      
          grid:{
            display:false
          }
        },
      
        y:{
          min:0,
          max:10,
      
          ticks:{
            color:"#fff"
          },
      
          grid:{
            color:"rgba(255,255,255,0.1)"
          }
        }
      
      }

    }

  });

}

/* OCORRÊNCIAS */

function addOc(){

  const aluno =
  document.getElementById("alunoOc")
  .value.trim();

  const serie = 
  document.getElementById("serieOc")
  .value;

  const tipo =
  document.getElementById("tipoOc")
  .value;

  const texto =
  document.getElementById("textoOc")
  .value.trim();

  if(!aluno || !serie || !tipo){

    alert("Preencha os campos obrigatórios!");

    return;
  }

  ocorrencias.push({
    aluno,
    serie,
    tipo,
    texto,

    data:
    new Date()
    .toLocaleDateString("pt-BR")
  });

  salvar();

  renderOc();

  document.getElementById("alunoOc").value = "";
  document.getElementById("serieOc").value = "";
  document.getElementById("tipoOc").value = "";
  document.getElementById("textoOc").value = "";
}

function renderOc(){

  const lista =
  document.getElementById("listaOc");

  lista.innerHTML = "";

  ocorrencias.forEach((o,index)=>{

    const div =
    document.createElement("div");

    div.className = "oc-card";

    div.innerHTML = `

    <div class="oc-header">
    
      <div class="oc-icon">⚠️</div>
    
      <div class="oc-info">
    
        <strong>${o.aluno}</strong>
    
        <small>
          📅 ${o.data}
        </small>
    
        <div class="oc-tags">
    
          <span class="tag-serie">
            ${o.serie}
          </span>
    
          <span class="tag-tipo">
            ${o.tipo}
          </span>
    
        </div>
    
      </div>
    
    </div>
    
    ${o.texto ? `
      <div class="oc-descricao">
        ${o.texto}
      </div>
    ` : ""}
    
    <button
      class="btn-excluir"
      onclick="excluirOc(${index})"
    >
      🗑️ Excluir
    </button>
    
    `;

    lista.appendChild(div);

  });

  atualizarHome();

  // MOSTRAR ÚLTIMAS OCORRÊNCIAS

 const box =
 document.getElementById("ocorrenciasRecentes");

 if(box){

  box.innerHTML = `
  <h2>${ocorrencias.length}</h2>
  <p>Ocorrências registradas</p>
 `;

 }

}

function excluirOc(indice){

  if(
    confirm(
      "Deseja excluir esta ocorrência?"
    )
  ){

    ocorrencias.splice(indice,1);

    salvar();

    renderOc();

  }

}

/* STORAGE */

function salvar(){

  localStorage.setItem(
    "alunos",
    JSON.stringify(alunos)
  );

  localStorage.setItem(
    "oc",
    JSON.stringify(ocorrencias)
  );

  localStorage.setItem(
    "agenda",
    JSON.stringify(agenda)
  );

}

function abrirAgenda(){

  document
    .getElementById("modalAgenda")
    .style.display = "flex";

}

function fecharAgenda(){

  document
    .getElementById("modalAgenda")
    .style.display = "none";

}

function addAgenda(){

  const data =
  document.getElementById("agendaData")
  .value;

  const dataFormatada =
new Date(data + "T00:00:00")
.toLocaleDateString("pt-BR");

  const turma =
  document.getElementById("agendaTurma")
  .value;

  const texto =
  document.getElementById("agendaTexto")
  .value.trim();

  if(!data || !texto){

    alert("Preencha os campos!");

    return;

  }

  agenda.push({
    data: dataFormatada,
    turma,
    texto
  });

  salvar();

  renderAgenda();

  fecharAgenda();

}

function renderAgenda(){

  const lista =
  document.getElementById("listaAgenda");

  if(!lista) return;

  lista.innerHTML = "";

  if(agenda.length === 0){

    lista.innerHTML =
    "<p>Nenhum compromisso cadastrado.</p>";

    return;

  }

  agenda.forEach((item, index) => {

    lista.innerHTML += `
  
      <div class="agenda-item">
  
      <div class="agenda-info">

      <div class="agenda-data">
        📅 ${item.data}
      </div>
    
      <div class="agenda-turma">
        🎓 ${item.turma}
      </div>
    
      <div class="agenda-texto">
        ${item.texto}
      </div>
    
    </div>
  
        <button
          class="btn-excluir-agenda"
          onclick="excluirAgenda(${index})"
        >
          🗑️
        </button>
  
      </div>
  
    `;
  
  });

}

function excluirAgenda(indice){

  if(confirm("Deseja excluir este compromisso?")){

    agenda.splice(indice, 1);

    salvar();

    renderAgenda();

  }

}

/* DADOS DAS TURMAS */

const dadosTurmas = {

    "3º Ano A":[
      {nome:"Ana Clara",nota:8.5},
      {nome:"Bruno Silva",nota:6.7},
      {nome:"Carlos Eduardo",nota:9.2}
    ],
  
    "2º Ano B":[
      {nome:"Fernanda",nota:7.8},
      {nome:"Gabriel",nota:5.9},
      {nome:"Juliana",nota:8.1}
    ],
  
    "1º Ano C":[
      {nome:"Lucas",nota:6.5},
      {nome:"Marina",nota:9.0},
      {nome:"Pedro",nota:7.4}
    ],
  
    "9º Ano D":[
      {nome:"Rafaela",nota:8.8},
      {nome:"Thiago",nota:6.0},
      {nome:"Vanessa",nota:7.2}
    ]
  
  };
  
  /* ABRIR TURMA */
  
  function abrirTurma(nomeTurma){

    irPara("alunosTurma");
  
    document
    .getElementById("nomeTurma")
    .textContent = nomeTurma;
  
    const alunos =
    dadosTurmas[nomeTurma];
  
    document
    .getElementById("infoTurma")
    .textContent =
    alunos.length + " alunos cadastrados";
  
    const tbody =
    document.getElementById("tbodyTurma");
  
    tbody.innerHTML = "";
  
    alunos.forEach((aluno,index)=>{
  
      const aprovado =
      aluno.nota >= 6;
  
      const tr =
      document.createElement("tr");
  
      tr.innerHTML = `
        <td>${index + 1}</td>
  
        <td>${aluno.nome}</td>
  
        <td>${aluno.nota}</td>
  
        <td>
          ${
            aprovado
            ? "✅ Aprovado"
            : "❌ Reprovado"
          }
        </td>
      `;
  
      tbody.appendChild(tr);
  
    });
  
    // =========================
    // ESTATÍSTICAS DA TURMA
    // =========================
  
    const notas =
    alunos.map(a => a.nota);
  
    const media =
    (
      notas.reduce((a,b)=>a+b,0)
      / notas.length
    ).toFixed(1);
  
    const maior =
    Math.max(...notas).toFixed(1);
  
    const menor =
    Math.min(...notas).toFixed(1);
  
    document
    .getElementById("mediaTurmaCard")
    .textContent = media;
  
    document
    .getElementById("maiorNota")
    .textContent = maior;
  
    document
    .getElementById("menorNota")
    .textContent = menor;
  
    renderGrafico(nomeTurma);
  
  }

// =========================
// SEGUNDO GRÁFICO GERAL
// =========================

const ctxHome2 =
document
.getElementById("chartHome2");

if(ctxHome2){

  new Chart(ctxHome2,{

    type:"bar",

    data:{

      labels:[
        "3º Ano A",
        "2º Ano B",
        "1º Ano C",
        "9º Ano D"
      ],

      datasets:[{

        label:"Médias das turmas",

        data:[
          8.2,
          7.1,
          6.8,
          9.0
        ],

        backgroundColor:[
          "#7c3aed",
          "#8b5cf6",
          "#a78bfa",
          "#c4b5fd"
        ],

        borderRadius: 12,
        borderSkipped: false,
        maxBarThickness: 80

      }]

    },

    options:{

      responsive:true,

      plugins:{

        legend:{
          display:false
        },

        tooltip:{
          backgroundColor:"#111827",
          padding:12,
          titleColor:"#fff",
          bodyColor:"#fff"
        }

      },

      scales:{

        y:{

          beginAtZero:true,

          max:10,

          ticks:{
            stepSize:1
          },
        
          grid:{
            color:"rgba(0,0,0,0.05)"
          }
          

        }

      },

      animation:{
        duration:1500
      },
    }

  });

}