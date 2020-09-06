$(document).ready(function () {

    // Inicialização da DataTable
    dtProducts = $("#table-products").DataTable({
        DOM: 'tp',
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
        deferRender: true,
        scrollY: 400,
        scrollX: true,
        ordering: true,
        columnDefs: [{
            className: 'text-center',
            targets: [2, 4, 5]
        }]
    })

    listarProdutos();

});

function listarProdutos() {

    $.ajax({

        url: '/produtos', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json' // tipo de resposta esperada do servidor

    }).done(function (resposta) {

        $.each(resposta, function (index, produto) {

            dtProducts.row.add([
                produto.nome,
                produto.descricao,
                produto.quantidade,
                'R$ ' + produto.preco,
                produto.status,
                '<a><i class="fa fa-pencil color-muted mr-1"></i></a>' +
                '<a><i class="fa fa-close color-danger"></i></a>'
            ])
        })

        dtProducts.draw();

    }).fail(function (error) {



    })

}