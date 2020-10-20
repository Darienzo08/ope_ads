const txtFornecedor = $("#txt-fornecedor");
const btnCadastrarNovoFornecedor = $('#cadastrar-fornecedor');
const btnAlterarFornecedor = $('#alterar-fornecedor')
const cnpjNovoFornecedor =  $('#cnpj-novo-fornecedor')
const nomeFornecedorNovoFornecedor =  $('#nome-novo-fornecedor')
const enderecoFornecedorNovoFornecedor =  $('#endereco-novo-fornecedor')
const modalFornecedorTitle = $('#modal-fornecedor-title');
const modalFornecedor = $('#modal-fornecedor');
const fornecedor = {};
const novoFornecedor = {};
const btnCadastrarNovoFornecedor = $('#cadastrar-fornecedor');
const txtCnpjForncedor = $('#txtCnpjForncedor');
const txtNomeFornecedor = $('#txtNomeFornecedor');
const txtEnderecoFornecedor = $('#txtEnderecoFornecedor');


const btnBuscar = $("#btn-buscar");

// ISSO AQUI
const btnCadastrar = $('#btn-cadastrar');

$(document).ready(function () {

    // Inicialização da DataTable
    dtFornecedores = $("#table-fornecedor").DataTable({
        dom: 'tp',
        language: {
            info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
            infoEmpty: "Não há nada para mostrar aqui",
            search: "Procurar",
            zeroRecords: "Nenhum fornecedor disponível",
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
            targets: '_all'
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

    listarFornecedores();

    // Faz a busca na tabela
    btnBuscar.click(function () {

        dtFornecedores.search(txtFornecedor.val()).draw();

    })

    btnCadastrar.click(function () {
        modalFornecedorTitle.text('Cadastrar fornecedor')

        btnAlterarFornecedor.addClass('d-none');
        btnCadastrarNovoFornecedor.removeClass('d-none');

        cnpjNovoFornecedor.val("");
        nomeFornecedorNovoFornecedor.val("");
        enderecoFornecedorNovoFornecedor.val("");

        modalFornecedor.modal('show')
    })

    btnCadastrarNovoFornecedor.click(function () {

        novoFornecedor.cnpj = cnpjNovoFornecedor.val();
        novoFornecedor.nomeFornecedor = nomeFornecedorNovoFornecedor.val();
        novoFornecedor.enderecoFornecedor = enderecoFornecedorNovoFornecedor.val();

        cadastrarFornecedores(novoFornecedor);

    })

    dtFornecedores.off('click').on('click', 'tr td a i.fa-pencil', function () {

        btnCadastrarNovoFornecedor.addClass('d-none');

        const row = $(this).closest("tr")
        const dadosFornecedor = dtFornecedores.row(row).data()

        fornecedor.cnpj = dadosFornecedor[0]
        fornecedor.nomeFornecedor = dadosFornecedor[1]
        fornecedor.enderecoFornecedor = dadosFornecedor[2]


        btnAlterarFornecedor.removeClass('d-none')
        modalFornecedorTitle.text('Alterar fornecedor: ' + fornecedor.nomeFornecedor)
        modalFornecedor.modal('show')

        cnpjNovoFornecedor.val(fornecedor.cnpj);
        nomeFornecedorNovoFornecedor.val(fornecedor.nomeFornecedor);
        enderecoFornecedorNovoFornecedor.val(fornecedor.enderecoFornecedor);

    })

    btnAlterarFornecedor.click(function () {

        produto.nome = nomeNovoProduto.val();
        produto.descricao = descNovoProduto.val();
        produto.preco = precoNovoProduto.val();

        fornecedor.cnpj = cnpjNovoFornecedor.val();
        fornecedor.nomeFornecedor = nomeFornecedorNovoFornecedor.val();
        fornecedor.enderecoFornecedor = enderecoFornecedorNovoFornecedor.val();

        alterarFornecedor(fornecedor);

    })

});

function listarFornecedores() {

    $.ajax({
        url: '/fornecedores', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json'

    }).done(function (resposta) {

        $.each(resposta, function (index, fornecedor) {

            dtFornecedores.row.add([
                // Coluna 00
                fornecedor.cnpj,
                // Coluna 01
                fornecedor.nomeFornecedor,
                // Coluna 02
                fornecedor.enderecoFornecedor,
                // Coluna 03
                ''

            ])
        })

        dtFornecedores.draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}

function cadastrarFornecedores(novoFornecedor) {

    btnCadastrarNovoFornecedor.prop('disabled', true);

    $.ajax({
        url: '/fornecedores', // URL do recurso requisitado
        method: 'POST', // método de requisição solicitado
        dataType: 'json', // tipo de resposta esperada do servidor
        contentType: 'application/json', // tipo de contéudo enviado
        data: JSON.stringify(novoFornecedor) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        listarFornecedores();

        dtFornecedores.search(novoFornecedor.nomeFornecedor).draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    }).always(function () {

        btnCadastrarNovoFornecedor.prop('disabled', false);

        cnpjNovoFornecedor.val("");
        nomeFornecedorNovoFornecedor.val("");
        enderecoFornecedorNovoFornecedor.val("");

        modalFornecedor.modal('hide');

    })

}

function alterarFornecedor(fornecedor) {

    btnAlterarFornecedor.prop('disabled', true);

    $.ajax({
        url: '/fornecedores/' + fornecedor.id, // URL do recurso requisitado
        method: 'PUT', // método de requisição solicitado
        dataType: 'json', // tipo de resposta esperada do servidor
        contentType: 'application/json', // tipo de contéudo enviado
        data: JSON.stringify(fornecedor) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        listarFornecedores();

        dtFornecedores.search(fornecedor.nomeFornecedor).draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    }).always(function () {

        btnAlterarFornecedor.prop('disabled', false);

        modalFornecedor.modal('hide');

    })

}