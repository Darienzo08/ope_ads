const btnBuscar = $('#btn-buscar');

const txtProduto = $('#txt-produto');

$(document).ready(function () {

    // Inicialização da DataTable
    dtEntrada = $("#table-entrada").DataTable({
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
        order: [[ 5, "asc" ]],
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
        },

        fnRowCallback: function (nRow, aData, iDisplayIndex) {

            var tipo = aData[4];

            if (tipo == 'Entrada') $(nRow).addClass('h5 saida');

            else $(nRow).addClass('h5 entrada');

        }

    })

    listarSaida();

    listarEntrada();

    // Faz a busca na tabela
    btnBuscar.click(function () {

        dtEntrada.search(txtProduto.val()).draw();

    })

})

function listarSaida() {

    dtEntrada.clear().draw();

    $.ajax({
        url: '/produtos/saida', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json' // tipo de resposta esperada do servidor

    }).done(function (resposta) {

        $.each(resposta, function (index, produto) {

            dtEntrada.row.add([
                // Coluna 00
                produto.nomeProduto,
                // Coluna 01
                produto.quantidadeSaida,
                // Coluna 02
                '-',
                // Coluna 03
                '-',
                // Coluna 04
                'Saída',
                // Coluna 05
                produto.dataSaida
            ])
        })

        dtEntrada.draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}

function listarEntrada() {

    dtEntrada.clear().draw();

    $.ajax({
        url: '/produtos/entrada', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json' // tipo de resposta esperada do servidor

    }).done(function (resposta) {

        $.each(resposta, function (index, produto) {

            dtEntrada.row.add([
                // Coluna 00
                produto.nomeProduto,
                // Coluna 01
                produto.quantidadeEntrada,
                // Coluna 02
                produto.nomeFornecedor,
                // Coluna 03
                'R$ ' + produto.precoEntrada,
                // Coluna 04
                'Entrada',
                // Coluna 0
                produto.dataEntrada
            ])
        })

        dtEntrada.draw();

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}