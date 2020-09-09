const btnBuscar = $('#btn-buscar');
const btnCadastrar = $('#btn-cadastrar');
const btnCadastrarNovoProduto = $('#cadastrar-produto')
const btnAlterarProduto = $('#alterar-produto')
const btnInativarProduto = $('#inativar-produto')

const txtProduto = $('#txt-produto');
const nomeNovoProduto = $('#nome-novo-produto')
const descNovoProduto = $('#desc-novo-produto')
const precoNovoProduto = $('#preco-novo-produto')

const modalProduto = $('#modal-produto');
const modalProdutoTitle = $('#modal-produto-title')

const modalInativarProduto = $('#modal-inativar-produto')
const modalInativarProdutoTitle = $('#modal-inativar-produto-title')

$(document).ready(function () {

    // Inicialização da DataTable
    dtProducts = $("#table-products").DataTable({
        dom: 'tp',
        language: {
            info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
            infoEmpty: "Não há nada para mostrar aqui",
            search: "Procurar",
            zeroRecords: "Nenhum produto disponível",
            paginate: {
                next: "Próximo",
                previous: "Anterior"
            }
        },
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        responsive: true,
        deferRender: true,
        scrollY: 400,
        scrollX: true,
        ordering: true,
        columnDefs: [{
            className: 'text-center',
            targets: [2, 4, 5]
        }],
        // adiciona o SlimScroll
        fnDrawCallback: function (oSettings) {

            $('.dataTables_scrollBody').slimScroll({

                height: "400px",
                width: '100%',
                axis: 'both',
                color: "#0e8d1f"
            })

        }
    })

    // Lista os produtos
    listarProdutos();

    // Faz a busca na tabela
    btnBuscar.click(function () {

        dtProducts.search(txtProduto.val()).draw();

    })

    // Invoca o modal de cadastro
    btnCadastrar.click(function () {

        modalProdutoTitle.text('Cadastrar produto')

        btnCadastrarNovoProduto.removeClass('d-none');

        modalProduto.modal('show')

    })

    // Realiza o cadastro
    btnCadastrarNovoProduto.click(function () {

        const novoProduto = {};

        novoProduto.nome = nomeNovoProduto.val();
        novoProduto.descricao = descNovoProduto.val();
        novoProduto.preco = precoNovoProduto.val();

        cadastrarProdutos(novoProduto);

    })

    // Invoca e preenche o modal de alteração
    dtProducts.on('click', 'tr td a i.fa-pencil', function (e) {

        const row = $(this).closest("tr")
        const dadosProduto = dtProducts.row(row).data()

        const produto = {};

        produto.id = dadosProduto[6]
        produto.nome = dadosProduto[0]
        produto.descricao = dadosProduto[1]
        produto.preco = dadosProduto[7]

        btnAlterarProduto.removeClass('d-none')
        modalProdutoTitle.text('Alterar produto: ' + produto.nome)
        modalProduto.modal('show')

        nomeNovoProduto.val(produto.nome);
        descNovoProduto.val(produto.descricao);
        precoNovoProduto.val(produto.preco);

        // Salva a alteração
        btnAlterarProduto.click(function () {

            produto.nome = nomeNovoProduto.val();
            produto.descricao = descNovoProduto.val();
            produto.preco = precoNovoProduto.val();

            alterarProduto(produto);

        })

    })

    // Invoca e preenche o modal de inativação
    dtProducts.on('click', 'tr td a i.fa-close', function (e) {

        const row = $(this).closest("tr")
        const dadosProduto = dtProducts.row(row).data()

        const produto = {};

        produto.id = dadosProduto[6]
        produto.nome = dadosProduto[0]
        produto.status = dadosProduto[8]

        modalInativarProduto.modal('show');
        modalInativarProdutoTitle.text('Inativar: ' + produto.nome)

        btnInativarProduto.click(function () {

            inativarProduto(produto);

        })

    })

});

function listarProdutos() {

    dtProducts.clear().draw();

    $.ajax({
        url: '/produtos', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json' // tipo de resposta esperada do servidor

    }).done(function (resposta) {

        $.each(resposta, function (index, produto) {

            status = '<span class="badge badge-pill badge-danger">Inativo</span>'

            if (produto.status == 1) status = '<span class="badge badge-pill badge-success">Ativo</span>';

            dtProducts.row.add([
                // Coluna 00
                produto.nome,
                // Coluna 01
                produto.descricao,
                // Coluna 02
                produto.quantidade,
                // Coluna 03
                'R$ ' + produto.preco,
                // Coluna 04
                status,
                // Coluna 05
                '<a href="javascript:void(0)"><i class="fa fa-pencil color-muted mr-1"></i></a>' +
                '<a href="javascript:void(0)"><i class="fa fa-close color-danger"></i></a>',
                // Hidden 06
                produto.id,
                // Hidden 07
                produto.preco,
                // Hidden 08
                produto.status
            ])
        })

        dtProducts.draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}

function cadastrarProdutos(novoProduto) {

    btnCadastrarNovoProduto.prop('disabled', true);

    $.ajax({
        url: '/produtos', // URL do recurso requisitado
        method: 'POST', // método de requisição solicitado
        dataType: 'json', // tipo de resposta esperada do servidor
        contentType: 'application/json', // tipo de contéudo enviado
        data: JSON.stringify(novoProduto) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        listarProdutos();

        dtProducts.search(novoProduto.nome).draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    }).always(function () {

        btnCadastrarNovoProduto.prop('disabled', false);

        btnCadastrarNovoProduto.addClass('d-none');

        nomeNovoProduto.val("");
        descNovoProduto.val("");
        precoNovoProduto.val("");

        modalProduto.modal('hide');

    })

}

function alterarProduto(produto) {

    btnAlterarProduto.prop('disabled', true);

    $.ajax({
        url: '/produtos/' + produto.id, // URL do recurso requisitado
        method: 'PUT', // método de requisição solicitado
        dataType: 'json', // tipo de resposta esperada do servidor
        contentType: 'application/json', // tipo de contéudo enviado
        data: JSON.stringify(produto) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        listarProdutos();

        dtProducts.search(produto.nome).draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    }).always(function () {

        btnAlterarProduto.prop('disabled', false);

        btnAlterarProduto.addClass('d-none');

        nomeNovoProduto.val("");
        descNovoProduto.val("");
        precoNovoProduto.val("");

        modalProduto.modal('hide');

    })

}

function inativarProduto(produto) {

    btnInativarProduto.prop('disabled', true);

    $.ajax({
        url: '/produtos/' + produto.id, // URL do recurso requisitado
        method: 'DELETE', // método de requisição solicitado
        dataType: 'json', // tipo de resposta esperada do servidor
        contentType: 'application/json', // tipo de contéudo enviado
        data: JSON.stringify(produto) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        listarProdutos();

        dtProducts.search(produto.nome).draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    }).always(function () {

        btnInativarProduto.prop('disabled', false);

        modalInativarProduto.modal('hide');

    })

}