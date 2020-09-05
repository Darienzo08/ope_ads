class Produto {

    constructor(param) {

        this.id = param.id;
        this.nome = param.nome;
        this.preco = param.preco;
        this.descricao = param.descricao;
        this.status = param.status;

        if (this.nome == undefined){
            throw{code: 1, name: "Campos faltantes", message: "O campo nome não foi enviado"}
        }

        if (this.preco == undefined){
            throw{code: 1, name: "Campos faltantes", message: "O campo preco não foi enviado"}
        }
    }
}

module.exports = Produto;