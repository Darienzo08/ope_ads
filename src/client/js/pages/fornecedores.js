const txtFornecedor = $("#txt-fornecedor");
const btnCadastrarNovoFornecedor = $('#cadastrar-fornecedor');
const btnAlterarFornecedor = $('#alterar-fornecedor');
const btnEntradaFornecedor = $('#btnEntradaFornecedor');
const cnpjNovoFornecedor =  $('#cnpjNovoFornecedor');
const nomeFornecedorNovoFornecedor =  $('#nomeFornecedorNovoFornecedor');
const enderecoFornecedorNovoFornecedor =  $('#enderecoFornecedorNovoFornecedor');
const modalFornecedorTitle = $('#modal-fornecedor-title');
const modalFornecedor = $('#modal-fornecedor');
const modalEntradaFornecedor = $('#modal-entrada-fornecedor');
const fornecedor = {};
const novoFornecedor = {};
const txtCnpjForncedor = $('#txtCnpjForncedor');
const txtNomeFornecedor = $('#txtNomeFornecedor');
const txtEnderecoFornecedor = $('#txtEnderecoFornecedor');


const btnBuscar = $("#btn-buscar");

const btnCadastrar = $('#btn-cadastrar');

$(document).ready(function () {

    // Inicialização da DataTable
    dtFornecedores = $("#table-fornecedor").DataTable({
        dom: 'Btp',
        buttons: [ 'copy', 'csv', 'excel', 'print' ],
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

        cnpjNovoFornecedor.val("");
        nomeFornecedorNovoFornecedor.val("");
        enderecoFornecedorNovoFornecedor.val("");

        modalFornecedorTitle.text("Cadastrar Fornecedor")

        modalFornecedor.modal('show')
    })
    

    btnCadastrarNovoFornecedor.click(function () {

        novoFornecedor.cnpj = cnpjNovoFornecedor.val();
        novoFornecedor.nomeFornecedor = nomeFornecedorNovoFornecedor.val();
        novoFornecedor.enderecoFornecedor = enderecoFornecedorNovoFornecedor.val();

        cadastrarFornecedores(novoFornecedor);

    })

    dtFornecedores.off('click.fa-pencil').on('click.fa-pencil', 'tr td a i.fa-pencil', function () {

        const row = $(this).closest("tr")
        const dadosProduto = dtFornecedores.row(row).data()

        cnpjNovoFornecedor.val(dadosProduto[0])
        nomeFornecedorNovoFornecedor.val(dadosProduto[1])
        enderecoFornecedorNovoFornecedor.val(dadosProduto[2])

        modalFornecedorTitle.text("Alterar Fornecedor")

        modalFornecedor.modal('show')
    
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
                '<a href="javascript:void(0)"><i class="fa fa-pencil color-muted mr-2"></i></a>'
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

        console.log(novoFornecedor.nomeFornecedor)

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