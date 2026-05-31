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

    document.getElementById("app")
    .style.display = "block";

    atualizarHome();

    renderAlunos();

    renderOc();
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

  const serie =
  document.getElementById(serie)
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

      <td>${a.serie || "-"}</td>

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

  document.getElementById("alunoOc").value = "";
  document.getElementById("textoOc").value = "";
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

  // MOSTRAR ÚLTIMAS OCORRÊNCIAS

const recentes =
ocorrencias.slice(-3).reverse();

const box =
document.getElementById("ocorrenciasRecentes");

if(box){

  box.innerHTML = "";

  if(recentes.length === 0){

    box.innerHTML =
    "<p>Nenhuma ocorrência registrada.</p>";

  } else {

    recentes.forEach(o=>{

      box.innerHTML += `
        <div class="oc-mini">
          <strong>${o.aluno}</strong>
          <span>${o.texto}</span>
        </div>
      `;

    });

  }

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
// GRÁFICO GERAL DAS TURMAS
// =========================

const ctxHome =
document.getElementById("chartHome");

if(ctxHome){

  new Chart(ctxHome,{

    type:"line",

    data:{

      labels:[
        "1º Bimestre",
        "2º Bimestre",
        "3º Bimestre",
        "4º Bimestre"
      ],

      datasets:[

        {
          label:"3º Ano A",

          data:[7.5,8.2,8.0,9.0],

          borderColor:"#ffffff",

          backgroundColor:"rgba(255,255,255,0.2)",

          tension:0.4,

          fill:false,

          pointRadius:4
        },

        {
          label:"2º Ano B",

          data:[6.8,7.1,7.4,7.9],

          borderColor:"#c4b5fd",

          tension:0.4,

          fill:false,

          pointRadius:4
        },

        {
          label:"1º Ano C",

          data:[5.9,6.8,7.0,7.3],

          borderColor:"#ddd6fe",

          tension:0.4,

          fill:false,

          pointRadius:4
        },

        {
          label:"9º Ano D",

          data:[7.2,8.0,8.5,9.1],

          borderColor:"#a78bfa",

          tension:0.4,

          fill:false,

          pointRadius:4
        }

      ]

    },

    options:{

      responsive:true,

      maintainAspectRatio:false,

      plugins:{

        legend:{
          labels:{
            color:"#fff"
          }
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