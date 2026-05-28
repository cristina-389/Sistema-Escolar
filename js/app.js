const U = "professor";
const P = "1234";

let alunos =
JSON.parse(localStorage.getItem("alunos")) || [];

let ocorrencias =
JSON.parse(localStorage.getItem("oc")) || [];

let chartObj;

/* LOGIN */

window.onload = function(){

  if(localStorage.getItem("login")){

    document.getElementById("login-page")
    .style.display = "none";

    atualizarHome();

    renderAlunos();

    renderOc();
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

}

/* NAVEGAÇÃO */

function irPara(id){

  document
  .querySelectorAll(".tela")
  .forEach(t => t.classList.remove("ativa"));

  document
  .getElementById(id)
  .classList.add("ativa");

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

  document.getElementById("home-total")
  .textContent = alunos.length;

  document.getElementById("home-oc")
  .textContent = ocorrencias.length;

}

/* ALUNOS */

function addAluno(){

  const nome =
  document.getElementById("nome")
  .value.trim();

  const nota =
  parseFloat(
    document.getElementById("nota").value
  );

  if(!nome || isNaN(nota)){

    alert("Dados inválidos!");

    return;
  }

  alunos.push({
    nome,
    nota
  });

  salvar();

  renderAlunos();

}

function renderAlunos(){

  const tbody =
  document.getElementById("tbody");

  tbody.innerHTML = "";

  alunos.forEach((a,i)=>{

    const aprovado = a.nota >= 6;

    const tr =
    document.createElement("tr");

    tr.innerHTML = `
      <td>${i+1}</td>

      <td>${a.nome}</td>

      <td>${a.nota}</td>

      <td>
        ${aprovado ? "Aprovado" : "Reprovado"}
      </td>
    `;

    tbody.appendChild(tr);

  });

  atualizarHome();

}

/* GRÁFICO */

function renderGrafico(turmaSelecionada = null){

  const canvas =
  document.getElementById("chart");

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
          ? "rgba(79,70,229,0.7)"
          : "rgba(239,68,68,0.7)"
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

        y:{
          min:0,
          max:10
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

  const texto =
  document.getElementById("textoOc")
  .value.trim();

  if(!aluno || !texto){

    alert("Preencha tudo!");

    return;
  }

  ocorrencias.push({
    aluno,
    texto
  });

  salvar();

  renderOc();

}

function renderOc(){

  const lista =
  document.getElementById("listaOc");

  lista.innerHTML = "";

  ocorrencias.forEach(o=>{

    const div =
    document.createElement("div");

    div.className = "oc-card";

    div.innerHTML = `
      <strong>${o.aluno}</strong>
      <p>${o.texto}</p>
    `;

    lista.appendChild(div);

  });

  atualizarHome();

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
  
    renderGrafico(nomeTurma);
  }

  
  