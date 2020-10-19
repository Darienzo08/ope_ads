const txtFornecedor = $("#txt-fornecedor");

const btnBuscar = $("#btn-buscar");

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