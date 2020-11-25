const btnBuscar = $("#btn-buscar");

const txtComanda = $('#txt-comandas');

$(document).ready(function () {

    // Inicialização da DataTable
    dtComandas = $("#table-comandas").DataTable({
        dom: 'Btp',
        buttons: ['copy', 'csv', 'excel', 'print'],
        language: {
            info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
            infoEmpty: "Não há nada para mostrar aqui",
            search: "Procurar",
            zeroRecords: "Nenhuma comanda disponível",
            paginate: {
                next: "Próximo",
                previous: "Anterior"
            }
        },
        "order": [[ 4, "asc" ]],
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

    // Listar comandas
    listarComanda()

    // Faz a busca na tabela
    btnBuscar.click(function () {

        dtPratos.search(txtComanda.val()).draw();

    })

});


function listarComanda() {

    $.ajax({
        url: '/comandas/', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json' // tipo de resposta esperada do servidor

    }).done(function (resposta) {

        $.each(resposta, function (index, comanda) {

            status = '<span class="badge badge-pill badge-danger">Fechada</span>'

            if (comanda.statusComanda == 0) status = '<span class="badge badge-pill badge-success">Aberta</span>';

            var data = comanda.dataComanda.split('.')

            data = data[0].replace('T', ' ')

            data = data.split(' ')

            horario = data[1].split(':')

            horario = `${horario[0]-3}:${horario[1]}:${horario[0]}`

            dtComandas.row.add([
                // Coluna 00
                comanda.idComanda,
                // Coluna 01
                'R$ ' + comanda.valorComanda,
                // Coluna 02
                comanda.numMesa,
                // Coluna 03
                `${data[0]} ${horario}`,
                // Coluna 04
                status
            ])
        })

        dtComandas.draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}