const btnBuscar = $('#btn-buscar');
const btnCadastrar = $('#btn-cadastrar');
const btnCadastrarNovoProduto = $('#cadastrar-produto');
const btnAlterarProduto = $('#alterar-produto');
const btnInativarProduto = $('#inativar-produto');
const btnEntrada = $('#btnEntrada');
const btnSaida = $('#btnSaida');
const btnFiltrar = $('#btn-filtrar');

const txtProduto = $('#txt-produto');
const txtPreco = $('#txtPreco');
const txtFornecedor = $('#txtFornecedor')
const txtQtdSaida = $('#txtQtdSaida')
const nomeNovoProduto = $('#nome-novo-produto');
const descNovoProduto = $('#desc-novo-produto');
const precoNovoProduto = $('#preco-novo-produto');
const quantidadeProdutos = $('#qtd-produtos');
const limiarProdutos = $('#limiar-novo-produto');
const txtEntrada = $('#txtEntrada');

const modalProduto = $('#modal-produto');
const modalProdutoTitle = $('#modal-produto-title');

const modalInativarProduto = $('#modal-inativar-produto');
const modalInativarProdutoTitle = $('#modal-inativar-produto-title');

const modalEntrada = $('#modal-entrada');
const modalSaida = $('#modal-saida');

const modalFiltrar = $('#modal-filtro');

const produto = {};
const novoProduto = {};

$(document).ready(function () {

    // Inicialização da DataTable
    dtProducts = $("#table-products").DataTable({
        dom: 'Btp',
        buttons: [ 'copy', 'csv', 'excel', 'print' ],
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
        },
        { targets: [1], visible: false }
    ],

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

    const qtdSlide = document.getElementById('qtd-slider');
    const qtd = {};
    qtd.min = 0;
    qtd.max = 950;

    noUiSlider.create(qtdSlide, {
        start: [50, 950],
        connect: true,
        tooltips: true,
        format: wNumb({
            decimals: 0
        }),
        range: {
            'min': 0,
            'max': 1000
        }
    });

    qtdSlide.noUiSlider.on('change', function (values, handle) {

        if (handle == 0) { qtd.min = parseInt(values[handle]); }

        if (handle == 1) { qtd.max = parseInt(values[handle]); }

        dtProducts.draw();

    });

    const precoSlider = document.getElementById('preco-slider');
    const preco = {};
    preco.min = 0;
    preco.max = 450;

    noUiSlider.create(precoSlider, {
        start: [50, 450],
        connect: true,
        tooltips: true,
        format: wNumb({
            thousand: '.',
            prefix: 'R$ '
        }),
        range: {
            'min': 0,
            'max': 500
        }
    });

    precoSlider.noUiSlider.on('change', function (values, handle) {

        if (handle == 0) { preco.min = parseInt(values[handle].replace('R$ ', '')); }

        if (handle == 1) { preco.max = parseInt(values[handle].replace('R$ ', '')); }

        dtProducts.draw();

    });

    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
          var min = qtd.min;
          var max = qtd.max;
          var col = parseFloat( data[2] ) || 0; // data[number] = column number
          if ( ( isNaN( min ) && isNaN( max ) ) ||
               ( isNaN( min ) && col <= max ) ||
               ( min <= col   && isNaN( max ) ) ||
               ( min <= col   && col <= max ) )
          {
            return true;
          }
          return false;
        },
         function( settings, data, dataIndex ) {
          var min = preco.min;
          var max = preco.max;
          var col = parseFloat( data[3].replace('R$ ', '') ) || 0; // data[number] = column number
          if ( ( isNaN( min ) && isNaN( max ) ) ||
               ( isNaN( min ) && col <= max ) ||
               ( min <= col   && isNaN( max ) ) ||
               ( min <= col   && col <= max ) )
          {
            return true;
          }
          return false;
        }
      );

    // Lista os produtos
    listarProdutos();

    // Carrega o select com os fornecedores
    listarFornecedores();

    // Faz a busca na tabela
    btnBuscar.click(function () {

        dtProducts.search(txtProduto.val()).draw();

    })

    // Invoca o modal de cadastro
    btnCadastrar.click(function () {

        modalProdutoTitle.text('Cadastrar produto')

        btnAlterarProduto.addClass('d-none');
        btnCadastrarNovoProduto.removeClass('d-none');

        nomeNovoProduto.val("");
        descNovoProduto.val("");
        precoNovoProduto.val("");
        limiarProdutos.val("");

        modalProduto.modal('show')

    })

    // Realiza o cadastro
    btnCadastrarNovoProduto.click(function () {

        novoProduto.nome = nomeNovoProduto.val();
        novoProduto.descricao = descNovoProduto.val();
        novoProduto.preco = precoNovoProduto.val();
        novoProduto.limiar = limiarProdutos.val();

        cadastrarProdutos(novoProduto);

    })

    // Invoca e preenche o modal de alteração
    dtProducts.off('click').on('click', 'tr td a i.fa-pencil', function () {

        btnCadastrarNovoProduto.addClass('d-none');

        const row = $(this).closest("tr")
        const dadosProduto = dtProducts.row(row).data()

        produto.id = dadosProduto[6]
        produto.nome = dadosProduto[0]
        produto.descricao = dadosProduto[1]
        produto.preco = dadosProduto[7]
        produto.limiar = dadosProduto[9]

        btnAlterarProduto.removeClass('d-none')
        modalProdutoTitle.text('Alterar produto: ' + produto.nome)
        modalProduto.modal('show')

        nomeNovoProduto.val(produto.nome);
        descNovoProduto.val(produto.descricao);
        precoNovoProduto.val(produto.preco);
        limiarProdutos.val(produto.limiar);

    })

    // Salva a alteração
    btnAlterarProduto.click(function () {

        produto.nome = nomeNovoProduto.val();
        produto.descricao = descNovoProduto.val();
        produto.preco = precoNovoProduto.val();
        produto.limiar = limiarProdutos.val();

        alterarProduto(produto);

    })

    // Invoca e preenche o modal de inativação
    dtProducts.off('click.fa-close').on('click.fa-close', 'tr td a i.fa-close', function () {

        const row = $(this).closest("tr")
        const dadosProduto = dtProducts.row(row).data()

        produto.id = dadosProduto[6]
        produto.nome = dadosProduto[0]
        produto.status = dadosProduto[8]
        produto.limiar = dadosProduto[9]

        modalInativarProduto.modal('show');
        modalInativarProdutoTitle.text('Inativar: ' + produto.nome)

    })

    // Realiza a inativação
    btnInativarProduto.click(function () {

        inativarProduto(produto);

    })

    // Realiza entrada de produto

    dtProducts.off('click.ion-arrow-up-a').on('click.ion-arrow-up-a', 'tr td a i.ion-arrow-up-a', function () {

        const row = $(this).closest("tr")
        const dadosProduto = dtProducts.row(row).data()

        produto.id = dadosProduto[6]
        produto.nome = dadosProduto[0]
        produto.status = dadosProduto[8]
        produto.quantidade = dadosProduto[2]
        produto.limiar = dadosProduto[9]

        modalEntrada.modal('show');
    
    })

    btnEntrada.click(function() {

        produto.idFornecedor = txtFornecedor.val()
        produto.preco = txtPreco.val()
        produto.quantidade = txtEntrada.val()

        entradaProdutos(produto)

    })


    // Realiza saida de produto

    dtProducts.off('click.ion-arrow-down-a').on('click.ion-arrow-down-a', 'tr td a i.ion-arrow-down-a', function () {

        const row = $(this).closest("tr")
        const dadosProduto = dtProducts.row(row).data()

        produto.id = dadosProduto[6]
        produto.quantidade = dadosProduto[2]

        modalSaida.modal('show');
    
    })

    btnSaida.click(function() {

        produto.quantidade = txtQtdSaida.val()

       saidaProdutos(produto)

    })

    btnFiltrar.click(function() {

        modalFiltrar.modal('show');

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
                '<a href="javascript:void(0)"><i class="fa fa-pencil color-muted mr-2"></i></a>' +
                '<a href="javascript:void(0)"><i class="fa fa-close color-danger mr-2"></i></a>' +
                '<a href="javascript:void(0)"><i class="ion ion-arrow-up-a mr-2"></i></a>' + 
                '<a href="javascript:void(0)"><i class="ion ion-arrow-down-a"></i></a>',
                // Hidden 06
                produto.id,
                // Hidden 07
                produto.preco,
                // Hidden 08
                produto.status,
                // Hidden 09
                produto.limiar
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

        nomeNovoProduto.val("");
        descNovoProduto.val("");
        precoNovoProduto.val("");
        limiarProdutos.val("");

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

function montarSelectProdutos() {

    selectProdutos.empty();

    $.ajax({
        url: '/produtos', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json' // tipo de resposta esperada do servidor

    }).done(function (resposta) {

        selectProdutos.append('<option></option>');

        $.each(resposta, function (index, produto) {

            selectProdutos.append('<option id="' + produto.id + '" data-quantidade = "' + produto.quantidade + '">' +
                produto.nome + ' - ' + produto.quantidade + ' em estoque</option>');

        })

    })

}

function entradaProdutos(produto) {

    btnEntrada.prop('disabled', true);

    $.ajax({
        url: '/produtos/entrada/' + produto.id, // URL do recurso requisitado
        method: 'POST', // método de requisição solicitado
        dataType: 'json',
        contentType: 'application/json', // tipo de resposta esperada do servidor
        data: JSON.stringify(produto) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        listarProdutos();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    }).always(function () {

        txtEntrada.val("");

        btnEntrada.prop('disabled', false);

        modalEntrada.modal('hide')

    })

}

function saidaProdutos(produto) {

    btnSaida.prop('disabled', true);

    $.ajax({
        url: '/produtos/saida/' + produto.id, // URL do recurso requisitado
        method: 'POST', // método de requisição solicitado
        dataType: 'json',
        contentType: 'application/json', // tipo de resposta esperada do servidor
        data: JSON.stringify(produto) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        listarProdutos();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    }).always(function () {

        quantidadeProdutos.val("");

        btnSaida.prop('disabled', false);

        modalSaida.modal('hide')

    })

}

function listarFornecedores() {

    $.ajax({
        url: '/fornecedores', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json',
        contentType: 'application/json', // tipo de resposta esperada do servidor
        data: JSON.stringify(produto) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        $.each(resposta, function (index, fornecedor) {

            txtFornecedor.append(

            `<option value="${fornecedor.cnpj}"> ${fornecedor.nomeFornecedor} </option>`

            )

        })

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}