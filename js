const dias = ["segunda", "terca", "quarta", "quinta", "sexta"];
let treinos = {};

window.onload = () => {
    treinos = JSON.parse(localStorage.getItem("treinos")) || {};
    dias.forEach(dia => {
        treinos[dia] ||= [];

        // RESETAR CHECKBOXES AO RECARREGAR
        treinos[dia].forEach(ex => {
            ex.series.forEach(s => s.feito = false);
        });
    });
};


function mostrarTreino() {
    const dia = document.getElementById("dia").value;

    dias.forEach(d => {
        const el = document.getElementById(d);
        el.style.display = "none";
        el.classList.remove("ativo");
    });

    if (!dia) {
        document.getElementById("mensagemInicial").style.display = "block";
        return;
    }

    document.getElementById("mensagemInicial").style.display = "none";

    const atual = document.getElementById(dia);
    atual.style.display = "block";
    atual.classList.add("ativo");

    renderizarTreino(dia);
}

function adicionarExercicio() {
    const dia = document.getElementById("dia").value;
    const nome = document.getElementById("nomeExercicio").value.trim();
    if (!dia || !nome) return;

    treinos[dia].push({ nome, series: [] });
    document.getElementById("nomeExercicio").value = "";

    salvar();
    renderizarTreino(dia);
}

function removerExercicio(dia, index) {
    if (!confirm("Deseja apagar este exercício?")) return;
    treinos[dia].splice(index, 1);
    salvar();
    renderizarTreino(dia);
}

function adicionarSerie(dia, ex, peso) {
    treinos[dia][ex].series.push({ peso, feito: false });
    salvar();
    renderizarTreino(dia);
}

function editarSerie(dia, ex, serie) {
    const novoPeso = prompt(
        "Novo peso (kg):",
        treinos[dia][ex].series[serie].peso
    );
    if (!novoPeso) return;

    treinos[dia][ex].series[serie].peso = Number(novoPeso);
    salvar();
    renderizarTreino(dia);
}

function toggleSerie(dia, ex, serie) {
    treinos[dia][ex].series[serie].feito =
        !treinos[dia][ex].series[serie].feito;
    salvar();
    renderizarTreino(dia);
}

function renderizarTreino(dia) {
    const ul = document.querySelector(`#${dia} ul`);
    ul.innerHTML = "";

    treinos[dia].forEach((ex, i) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${ex.nome}</strong>
            <button onclick="removerExercicio('${dia}', ${i})">🗑️</button>
        `;

        ex.series.forEach((s, j) => {
            const div = document.createElement("div");
            div.className = `serie ${s.feito ? "concluida" : ""}`;

            const chk = document.createElement("input");
            chk.type = "checkbox";
            chk.checked = s.feito;
            chk.onchange = () => toggleSerie(dia, i, j);

            const span = document.createElement("span");
            span.textContent = `${s.peso} kg`;
            span.onclick = () => editarSerie(dia, i, j);

            div.appendChild(chk);
            div.appendChild(span);
            li.appendChild(div);
        });

        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = "Adicionar série (kg)";
        input.onkeydown = e => {
            if (e.key === "Enter" && input.value) {
                adicionarSerie(dia, i, Number(input.value));
                input.value = "";
            }
        };

        li.appendChild(input);
        ul.appendChild(li);
    });

    atualizarContador(dia);
}

function atualizarContador(dia) {
    const total = treinos[dia].length;
    document.getElementById(`contador-${dia}`).textContent =
        total ? `— ${total} exercícios` : "";
}

function salvar() {
    localStorage.setItem("treinos", JSON.stringify(treinos));
}
