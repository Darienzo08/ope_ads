// Pega a data atual
const data = new Date();

const mes = data.getMonth();
const ano = data.getFullYear();

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

$(document).ready(function () {

    montarPaineis();

    montarLimiar();

    montarUltimosProdutos();

    $('#limiar').slimscroll({
        position: "right",
        size: "5px",
        height: "390px",
        color: "transparent"
    });

    $('#compras').slimscroll({
        position: "right",
        size: "5px",
        height: "390px",
        color: "transparent"
    });

    $('#extra-area-chart').slimscroll({
        position: "right",
        size: "5px",
        height: "390px",
        color: "transparent"
    });

    // Extra chart
    Morris.Area({
        element: 'extra-area-chart',
        data: [
            {
                period: '2020-11-11',
                vendas: 8,
                gastos: 50
            },
            {
                period: '2020-11-12',
                vendas: 24,
                gastos: 7
            },
            {
                period: '2020-11-13',
                vendas: 19,
                gastos: 14
            },
            {
                period: '2020-11-14',
                vendas: 10,
                gastos: 20
            },
            {
                period: '2020-11-15',
                vendas: 12,
                gastos: 18
            },
            {
                period: '2020-11-16',
                vendas: 80,
                gastos: 50
            },
            {
                period: '2020-11-17',
                vendas: 10,
                gastos: 20
            },
            {
                period: '2020-11-18',
                vendas: 15,
                gastos: 18
            },
            {
                period: '2020-11-19',
                vendas: 80,
                gastos: 50
            }
        ],
        lineColors: ['#f25521', '#0055ff'],
        xkey: 'period',
        ykeys: ['gastos', 'vendas'],
        labels: ['gastos', 'vendas'],
        pointSize: 0,
        lineWidth: 0,
        resize: true,
        fillOpacity: 0.8,
        behaveLikeLine: true,
        gridLineColor: 'transparent',
        hideHover: 'auto'

    });

});

function montarPaineis() {

    // Produtos comprados
    $.ajax({
        url: '/dashboard/quantidade', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json'

    }).done(function (resposta) {

        $('#produtos-comprados h2').text(resposta[0].qtd);

        $('#produtos-comprados p').text(`${meses[mes]} - ${ano}`);

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

    // Valor gasto
    $.ajax({
        url: '/dashboard/precos', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json'

    }).done(function (resposta) {

        $('#valor-gasto h2').text(formatarReal(resposta[0].preco));

        $('#valor-gasto p').text(`${meses[mes]} - ${ano}`);

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

    // Vendas realizadas
    $.ajax({
        url: '/dashboard/vendas', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json'

    }).done(function (resposta) {

        $('#vendas-realizadas h2').text(resposta[0].valor);

        $('#vendas-realizadas p').text(`${meses[mes]} - ${ano}`);

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

    // Valor recebido
    $.ajax({
        url: '/dashboard/recebido', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json'

    }).done(function (resposta) {

        $('#valor-recebido h2').text(formatarReal(resposta[0].valor));

        $('#valor-recebido p').text(`${meses[mes]} - ${ano}`);

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}

function montarLimiar() {

    $.ajax({
        url: '/dashboard/limiar', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json'

    }).done(function (resposta) {

        $.each(resposta, function (index, produto) {

            $('#limiar').append(
            '<div class="media border-bottom-1 pt-3 pb-3">' +
            '<div class="media-body">' +
                `<h5>${produto.nome}</h5>` +
            `<p class="mb-0">${produto.quantidade} produtos ainda em estoque</p>` +
            `</div><span class="text-muted ">${produto.limiar} limiar </span>` +
            '</div>')

        })

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}

function montarUltimosProdutos() {

    $.ajax({
        url: '/dashboard/ultimos', // URL do recurso requisitado
        method: 'GET', // método de requisição solicitado
        dataType: 'json'

    }).done(function (resposta) {

        $.each(resposta, function (index, produto) {

            $('#compras').append(

                `<div class="media border-bottom-1 pt-3 pb-3">` +
                `<div class="media-body">` +
                    `<h5> ${produto.nomeProduto}</h5>` + 
                    `<p class="mb-0">${produto.nomeFornecedor} - ${formatarData(produto.data_entrada)}</p>` + 
                `</div><span class="text-muted ">Qtd. ${produto.quantidadeEntrada}</span>` +
                `</div>`

            )

        })

    }).fail(function (error) {

        alert('Ocorreu um erro, tente novamente')

    })

}