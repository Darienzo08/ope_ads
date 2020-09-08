$(document).ready(function () {

    btnBuscar = $('#btn-buscar');
    btnCadastrar = $('#btn-cadastrar');

    txtProduto = $('#txt-produto');

    modalProduto = $('#modal-produto');

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

    listarProdutos();

    btnBuscar.click(function () {

        dtProducts.search(txtProduto.val()).draw();

    })

    btnCadastrar.click(function(){

        modalProduto.modal('show')

    })

});

function listarProdutos() {

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
                '<a href="#"><i class="fa fa-pencil color-muted mr-1"></i></a>' +
                '<a href="#"><i class="fa fa-close color-danger"></i></a>',
                //Hidden 06
                produto.id
            ])
        })

        dtProducts.draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}