class Produto {

    constructor(param) {

        this.id = param.id;
        this.nome = param.nome;
        this.preco = param.preco;
        this.descricao = param.descricao;
        this.status = param.status;
    }

    cadastrar() {}

    alterar() {}

    deletar() {}

    entrada() {}

    saida() {}
}

module.exports = Produto;