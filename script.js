const btnLogout = document.querySelector('#btn-logout');
const infoUsuario = document.querySelector('#usuario-logado-info');
const inputTarefa = document.querySelector('#input-tarefa');
const inputDescricao = document.querySelector('#input-descricao');
const inputData = document.querySelector('#input-data');
const selectHora = document.querySelector('#select-hora');
const selectMinuto = document.querySelector('#select-minuto');
const btnAdicionar = document.querySelector('#btn-adicionar');
const listaTarefas = document.querySelector('#lista-tarefas');
const usuarioLogado = localStorage.getItem('usuarioLogado');

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

function popularSeletoresDeTempo() {
    for (let i = 0; i <= 23; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.innerText = i.toString().padStart(2, '0');
        selectHora.appendChild(option);
    }
    for (let i = 0; i < 60; i += 5) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.innerText = i.toString().padStart(2, '0');
        selectMinuto.appendChild(option);
    }
}

function adicionarTarefa(tarefaObjeto) {
    let texto, descricao, data, hora, concluida, destacada;

    if (tarefaObjeto) {
        texto = tarefaObjeto.texto;
        descricao = tarefaObjeto.descricao;
        data = tarefaObjeto.data;
        hora = tarefaObjeto.hora;
        concluida = tarefaObjeto.concluida;
        destacada = tarefaObjeto.destacada;
    } else {
        texto = inputTarefa.value;
        descricao = inputDescricao.value.trim();
        data = inputData.value;
        hora = `${selectHora.value}:${selectMinuto.value}`;
        concluida = false;
        destacada = false;
    }

    if (texto.trim() === '') {
        alert("Por favor, digite pelo menos o título da tarefa.");
        return;
    }

    const itemDaLista = document.createElement('li');
    if (concluida) itemDaLista.classList.add('concluida');
    if (destacada) itemDaLista.classList.add('destacada');
    
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info-tarefa');
    infoDiv.addEventListener('click', marcarComoConcluida);

    const textoSpan = document.createElement('span');
    textoSpan.classList.add('texto-da-tarefa');
    textoSpan.innerText = texto;
    infoDiv.appendChild(textoSpan);

    if (descricao) {
        const descricaoP = document.createElement('p');
        descricaoP.classList.add('descricao-tarefa');
        descricaoP.innerText = descricao;
        infoDiv.appendChild(descricaoP);
    }

    if (data || hora) {
        const dataHoraSpan = document.createElement('span');
        dataHoraSpan.classList.add('data-hora-tarefa');
        const dataFormatada = formatarData(data);
        dataHoraSpan.innerText = `${dataFormatada} ${hora}`.trim();
        infoDiv.appendChild(dataHoraSpan);
    }

    const botoesDiv = document.createElement('div');
    botoesDiv.classList.add('botoes-tarefa');

    const btnDestaque = document.createElement('button');
    btnDestaque.classList.add('btn-destaque');
    btnDestaque.innerHTML = '⭐';
    btnDestaque.addEventListener('click', alternarDestaque);

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn-editar');
    btnEditar.innerHTML = '✏️';
    btnEditar.addEventListener('click', alternarModoEdicao);

    const btnRemover = document.createElement('button');
    btnRemover.classList.add('btn-remover');
    btnRemover.innerHTML = '🗑️';
    btnRemover.addEventListener('click', removerTarefa);
    
    botoesDiv.appendChild(btnDestaque);
    botoesDiv.appendChild(btnEditar);
    botoesDiv.appendChild(btnRemover);
    
    itemDaLista.appendChild(infoDiv);
    itemDaLista.appendChild(botoesDiv);
    listaTarefas.appendChild(itemDaLista);

    if (!tarefaObjeto) {
        inputTarefa.value = '';
        inputDescricao.value = '';
        inputData.value = '';
        inputTarefa.focus();
    }
    
    renderizarListaOrdenada();
    salvarTarefas();
}

function marcarComoConcluida(event) {
    const itemClicado = event.target.closest('li');
    if (itemClicado && !itemClicado.classList.contains('em-edicao')) {
        itemClicado.classList.toggle('concluida');
        salvarTarefas();
    }
}

function removerTarefa(event) {
    const itemParaRemover = event.target.closest('li');
    if (confirm("Você tem certeza que deseja excluir esta tarefa?")) {
        itemParaRemover.remove();
        salvarTarefas();
    }
}

function alternarDestaque(event) {
    event.stopPropagation();
    const itemDaLista = event.target.closest('li');
    if (itemDaLista) {
        itemDaLista.classList.toggle('destacada');
        salvarTarefas();
    }
}

function alternarModoEdicao(event) {
    event.stopPropagation();
    const itemDaLista = event.target.closest('li');
    const infoDiv = itemDaLista.querySelector('.info-tarefa');
    const btnEditar = itemDaLista.querySelector('.btn-editar');
    const estaEditando = itemDaLista.classList.contains('em-edicao');

    if (estaEditando) {
        const inputTexto = infoDiv.querySelector('.input-edicao-texto');
        const inputDescricao = infoDiv.querySelector('.input-edicao-descricao');
        const inputDataEdicao = infoDiv.querySelector('.input-edicao-data');
        const horaOriginal = itemDaLista.dataset.horaOriginal || '';
        
        infoDiv.innerHTML = '';

        const textoSpan = document.createElement('span');
        textoSpan.classList.add('texto-da-tarefa');
        textoSpan.innerText = inputTexto.value;
        infoDiv.appendChild(textoSpan);

        if (inputDescricao.value) {
            const descricaoP = document.createElement('p');
            descricaoP.classList.add('descricao-tarefa');
            descricaoP.innerText = inputDescricao.value;
            infoDiv.appendChild(descricaoP);
        }
        
        if (inputDataEdicao.value || horaOriginal) {
            const dataHoraSpan = document.createElement('span');
            dataHoraSpan.classList.add('data-hora-tarefa');
            const dataFormatada = formatarData(inputDataEdicao.value);
            dataHoraSpan.innerText = `${dataFormatada} ${horaOriginal}`.trim();
            infoDiv.appendChild(dataHoraSpan);
        }

        btnEditar.innerHTML = '✏️';
        itemDaLista.classList.remove('em-edicao');
        renderizarListaOrdenada();
        salvarTarefas();
    } else {
        const textoAtual = infoDiv.querySelector('.texto-da-tarefa').innerText;
        const descricaoAtual = infoDiv.querySelector('.descricao-tarefa')?.innerText || '';
        const dataHoraTexto = infoDiv.querySelector('.data-hora-tarefa')?.innerText || '';
        
        let dataAtual = '';
        let horaAtual = '';
        if (dataHoraTexto) {
            const [dataParte, horaParte] = dataHoraTexto.split(' ');
            dataAtual = desformatarData(dataParte);
            horaAtual = horaParte || '';
        }
        itemDaLista.dataset.horaOriginal = horaAtual;
        
        infoDiv.innerHTML = '';

        const inputTexto = document.createElement('input');
        inputTexto.type = 'text';
        inputTexto.value = textoAtual;
        inputTexto.classList.add('input-edicao-texto');

        const inputDescricao = document.createElement('textarea');
        inputDescricao.value = descricaoAtual;
        inputDescricao.classList.add('input-edicao-descricao');
        inputDescricao.rows = 2;

        const inputDataEdicao = document.createElement('input');
        inputDataEdicao.type = 'date';
        inputDataEdicao.value = dataAtual;
        inputDataEdicao.classList.add('input-edicao-data');
        
        infoDiv.appendChild(inputTexto);
        infoDiv.appendChild(inputDescricao);
        infoDiv.appendChild(inputDataEdicao);

        btnEditar.innerHTML = '💾';
        itemDaLista.classList.add('em-edicao');
    }
}

function formatarData(data) {
    if (!data) return '';
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function desformatarData(data) {
    if (!data) return '';
    const partes = data.split('/');
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

function renderizarListaOrdenada() {
    const itens = Array.from(listaTarefas.querySelectorAll('li'));
    itens.sort((a, b) => {
        const dataHoraTextoA = a.querySelector('.data-hora-tarefa')?.innerText || '';
        const dataHoraTextoB = b.querySelector('.data-hora-tarefa')?.innerText || '';

        if (!dataHoraTextoA && !dataHoraTextoB) return 0;
        if (!dataHoraTextoA) return 1;
        if (!dataHoraTextoB) return -1;
        
        const [dataA, horaA] = dataHoraTextoA.split(' ');
        const [dataB, horaB] = dataHoraTextoB.split(' ');
        const valorA = `${desformatarData(dataA)}T${horaA || '00:00'}`;
        const valorB = `${desformatarData(dataB)}T${horaB || '00:00'}`;
        
        return valorA.localeCompare(valorB);
    });
    itens.forEach(item => listaTarefas.appendChild(item));
}

function salvarTarefas() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    const tarefasNaTela = [];

    document.querySelectorAll('#lista-tarefas li').forEach(itemDaLista => {
        const estaEditando = itemDaLista.classList.contains('em-edicao');
        let texto, descricao, data, hora;

        if (estaEditando) {
            texto = itemDaLista.querySelector('.input-edicao-texto').value;
            descricao = itemDaLista.querySelector('.input-edicao-descricao').value;
            data = itemDaLista.querySelector('.input-edicao-data').value;
            hora = itemDaLista.dataset.horaOriginal || '';
        } else {
            texto = itemDaLista.querySelector('.texto-da-tarefa').innerText;
            descricao = itemDaLista.querySelector('.descricao-tarefa')?.innerText || '';
            const dataHoraTexto = itemDaLista.querySelector('.data-hora-tarefa')?.innerText || '';
            const [dataParte, horaParte] = dataHoraTexto.split(' ');
            data = dataParte ? desformatarData(dataParte) : '';
            hora = horaParte || '';
        }

        tarefasNaTela.push({
            texto,
            descricao,
            data,
            hora,
            concluida: itemDaLista.classList.contains('concluida'),
            destacada: itemDaLista.classList.contains('destacada')
        });
    });

    if (usuarios[usuarioLogado]) {
        usuarios[usuarioLogado].tarefas = tarefasNaTela;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

function carregarTarefas() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    if (usuarioLogado && usuarios[usuarioLogado]) {
        const tarefasDoUsuario = usuarios[usuarioLogado].tarefas || [];
        tarefasDoUsuario.forEach(tarefa => adicionarTarefa(tarefa));
    }
}

btnAdicionar.addEventListener('click', () => adicionarTarefa(null));

inputTarefa.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        adicionarTarefa(null);
    }
});

btnLogout.addEventListener('click', fazerLogout);

document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = 'login.html';
        return;
    }
    
    infoUsuario.innerText = `Logado como: ${usuarioLogado}`;
    popularSeletoresDeTempo();
    carregarTarefas();
});