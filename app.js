let selecionados = {};


function chave(categoria, nome) {
    return categoria + "___" + nome;
}


/* =========================
   MOSTRAR CATÁLOGO
========================= */

function renderCatalogo() {

    const pesquisa =
        document
        .getElementById("pesquisa")
        .value
        .toLowerCase();

    const catalogo =
        document.getElementById("catalogo");

    catalogo.innerHTML = "";


    MATERIAIS.forEach(grupo => {

        const itensFiltrados =
            grupo.itens.filter(item =>
                item[0]
                .toLowerCase()
                .includes(pesquisa)
            );


        if (itensFiltrados.length === 0) {
            return;
        }


        const categoria =
            document.createElement("section");

        categoria.className = "categoria";


        const titulo =
            document.createElement("h2");

        titulo.textContent =
            grupo.categoria;

        categoria.appendChild(titulo);


        itensFiltrados.forEach(item => {

            const nome = item[0];
            const unidade = item[1];

            const id =
                chave(grupo.categoria, nome);


            const quantidade =
                selecionados[id]
                ? selecionados[id].quantidade
                : 0;


            const linha =
                document.createElement("div");

            linha.className = "item";


            linha.innerHTML = `

                <span class="nome">
                    ${nome}
                </span>

                <span class="unidade">
                    ${unidade}
                </span>

                <div class="controles">

                    <button
                        onclick="alterarQuantidade(
                            '${grupo.categoria}',
                            '${nome}',
                            '${unidade}',
                            -1
                        )"
                    >
                        −
                    </button>

                    <span class="quantidade">
                        ${quantidade}
                    </span>

                    <button
                        onclick="alterarQuantidade(
                            '${grupo.categoria}',
                            '${nome}',
                            '${unidade}',
                            1
                        )"
                    >
                        +
                    </button>

                </div>
            `;


            categoria.appendChild(linha);

        });


        catalogo.appendChild(categoria);

    });


    renderLista();

}


/* =========================
   ADICIONAR / REMOVER
========================= */

function alterarQuantidade(
    categoria,
    nome,
    unidade,
    valor
) {

    const id =
        chave(categoria, nome);


    if (!selecionados[id]) {

        selecionados[id] = {

            categoria: categoria,
            nome: nome,
            unidade: unidade,
            quantidade: 0

        };

    }


    selecionados[id].quantidade += valor;


    if (
        selecionados[id].quantidade <= 0
    ) {

        delete selecionados[id];

    }


    renderCatalogo();

}


/* =========================
   LISTA FINAL
========================= */

function renderLista() {

    const lista =
        document.getElementById(
            "listaSelecionada"
        );


    const materiais =
        Object.values(selecionados);


    if (materiais.length === 0) {

        lista.innerHTML =
            "<p>Nenhum material selecionado.</p>";

        return;

    }


    materiais.sort((a,b) => {

        return a.categoria.localeCompare(
            b.categoria
        );

    });


    lista.innerHTML = "";


    materiais.forEach(material => {

        const linha =
            document.createElement("div");

        linha.className =
            "linha-material";


        linha.innerHTML = `

            <strong>
                ${material.quantidade}
            </strong>

            <span>
                ${material.unidade}
            </span>

            <span>
                ${material.nome}
            </span>

        `;


        lista.appendChild(linha);

    });

}


/* =========================
   LIMPAR
========================= */

function limparLista() {

    const confirmar =
        confirm(
            "Deseja realmente limpar toda a lista?"
        );


    if (!confirmar) {
        return;
    }


    selecionados = {};

    renderCatalogo();

}


/* =========================
   GERAR PDF
========================= */

function gerarPDF() {

    const cliente =
        document
        .getElementById("cliente")
        .value
        .trim();


    const endereco =
        document
        .getElementById("endereco")
        .value
        .trim();


    const data =
        document
        .getElementById("data")
        .value;


    const materiais =
        Object.values(selecionados);


    if (materiais.length === 0) {

        alert(
            "Adicione pelo menos um material."
        );

        return;

    }


    let tabela = "";


    let categoriaAtual = "";


    materiais.sort((a,b) => {

        return (
            a.categoria.localeCompare(
                b.categoria
            )
            ||
            a.nome.localeCompare(
                b.nome
            )
        );

    });


    materiais.forEach(material => {


        if (
            material.categoria !==
            categoriaAtual
        ) {

            categoriaAtual =
                material.categoria;


            tabela += `

                <tr class="categoria-pdf">

                    <td colspan="3">
                        ${categoriaAtual}
                    </td>

                </tr>

            `;

        }


        tabela += `

            <tr>

                <td>
                    ${material.quantidade}
                </td>

                <td>
                    ${material.unidade}
                </td>

                <td>
                    ${material.nome}
                </td>

            </tr>

        `;

    });


    const dataFormatada =
        data
        ? data.split("-").reverse().join("/")
        : new Date().toLocaleDateString(
            "pt-BR"
        );


    const janela =
        window.open(
            "",
            "_blank"
        );


    janela.document.write(`

<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>
Lista de Material
</title>


<style>

body {

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    margin: 40px;

    color: #222;

}


h1 {

    text-align: center;

    font-size: 22px;

    margin-bottom: 5px;

}


.subtitulo {

    text-align: center;

    font-size: 15px;

    margin-bottom: 30px;

}


.dados {

    margin-bottom: 25px;

    line-height: 1.8;

}


table {

    width: 100%;

    border-collapse:
        collapse;

}


th {

    text-align: left;

    padding: 9px;

    border-bottom:
        2px solid #222;

}


td {

    padding: 8px;

    border-bottom:
        1px solid #ddd;

}


.categoria-pdf td {

    background: #e8edf2;

    font-weight: bold;

    border-bottom: none;

}


.rodape {

    margin-top: 40px;

    font-size: 11px;

    color: #666;

}


</style>

</head>


<body>


<h1>
RICARDO BARBOSA RIBEIRO
</h1>


<div class="subtitulo">
LISTA DE MATERIAL
</div>


<div class="dados">

<strong>
Cliente:
</strong>

${cliente || "Não informado"}

<br>


<strong>
Endereço:
</strong>

${endereco || "Não informado"}

<br>


<strong>
Data:
</strong>

${dataFormatada}

</div>


<table>

<thead>

<tr>

<th>
Quantidade
</th>

<th>
Unidade
</th>

<th>
Material
</th>

</tr>

</thead>


<tbody>

${tabela}

</tbody>

</table>


<div class="rodape">

Lista de material - Ricardo Barbosa Ribeiro

</div>


<script>

window.onload = function() {

    window.print();

};

<\/script>


</body>

</html>

`);


    janela.document.close();

}


/* =========================
   PESQUISA
========================= */

document
    .getElementById("pesquisa")
    .addEventListener(
        "input",
        renderCatalogo
    );


/* =========================
   DATA AUTOMÁTICA
========================= */

document
    .getElementById("data")
    .valueAsDate =
        new Date();


/* =========================
   INICIAR
========================= */

renderCatalogo();