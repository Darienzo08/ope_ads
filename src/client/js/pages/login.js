const btnLogin = $('#btn-login');

const txtLogin = $('#login');
const txtSenha = $('#senha');

$(document).ready(function () {

    btnLogin.click(function () {

        const login = {};

        login.user = txtLogin.val();
        login.pwd = txtSenha.val();

        realizarLogin(login);

    })

})

function realizarLogin(user) {

    $.ajax({
        url: '/login', // URL do recurso requisitado
        method: 'POST', // método de requisição solicitado
        dataType: 'json', // tipo de resposta esperada do servidor
        contentType: 'application/json', // tipo de resposta esperada do servidor
        data: JSON.stringify(user) // dados a serem enviados no corpo da requisiçãso

    }).done(function (resposta) {

        window.location = "dashboard.html"

        localStorage.setItem('Jwt', resposta.token);

    }).fail(function (resposta) {

        toastr.error(resposta.responseJSON.message, resposta.responseJSON.name, {
            positionClass: "toast-top-right",
            timeOut: 5e3,
            closeButton: !0,
            debug: !1,
            newestOnTop: !0,
            progressBar: !0,
            preventDuplicates: !0,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            tapToDismiss: !1
        })

    })

}