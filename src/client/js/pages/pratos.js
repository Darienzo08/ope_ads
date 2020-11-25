const btnBuscar = $("#btn-buscar");

const txtPrato = $('#txt-prato');

$(document).ready(function () {

    // Inicialização da DataTable
    dtPratos = $("#table-pratos").DataTable({
        dom: 'Btp',
        buttons: ['copy', 'csv', 'excel', 'print'],
        language: {
            info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
            infoEmpty: "Não há nada para mostrar aqui",
            search: "Procurar",
            zeroRecords: "Nenhum prato disponível",
            paginate: {
                next: "Próximo",
                previous: "Anterior"
            }
        },
        responsive: true,
        deferRender: true,
        scrollY: 540,
        scrollX: true,
        ordering: true,
        columnDefs: [{
            className: 'text-center',
            targets: '_all'
        }],

        // adiciona o SlimScroll
        fnDrawCallback: function (oSettings) {

            $('.dataTables_scrollBody').slimScroll({

                height: "540px",
                width: '100%',
                axis: 'both',
                color: "#0e8d1f"
            })
        }

    })

    // Lista os pratos
    listarPratos();

    // Faz a busca na tabela
    btnBuscar.click(function () {

        dtPratos.search(txtPrato.val()).draw();

    })

})

function listarPratos() {

    $.ajax({
        url: '/pratos/', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json' // tipo de resposta esperada do servidor

    }).done(function (resposta) {

        $.each(resposta, function (index, prato) {

            status = '<span class="badge badge-pill badge-danger">Inativo</span>'

            if (prato.statusItem == 1) status = '<span class="badge badge-pill badge-success">Ativo</span>';

            dtPratos.row.add([
                // Coluna 00
                prato.nomeItem,
                // Coluna 01
                "R$ " + prato.valorItem,
                // Coluna 02
                status,
                // Coluna 03
                '<a href="javascript:void(0)"><i class="fa fa-pencil color-muted mr-2"></i></a>' +
                '<a href="javascript:void(0)"><i class="fa fa-close color-danger mr-2"></i></a>'
            ])
        })

        dtPratos.draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}