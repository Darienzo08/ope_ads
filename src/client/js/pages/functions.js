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