$(document).ready(function () {



})

function validarSessao() {

    $.ajax({
        url: '/sessao', // URL do recurso requisitado
        method: 'POST', // método de requisição solicitado
        dataType: 'json', // tipo de resposta esperada do servidor
        headers: { jwt: localStorage.getItem('Jwt') }

    }).fail(function (resposta) {

        window.location = 'index.html'

    })

}

function formatarReal(valor) {

    valor = parseFloat(valor).toFixed(2);

    return `R$ ${valor}`

}

function formatarData(valor) {

    valor = valor.split('T')
    valor = valor[0].split('-')

    return `${valor[2]}/${valor[1]}/${valor[0]}`

}