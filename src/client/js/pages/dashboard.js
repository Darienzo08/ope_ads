$(document).ready(function () {

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