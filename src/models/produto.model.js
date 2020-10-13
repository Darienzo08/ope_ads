class Produto {

    constructor(param) {

        this.id = param.id;
        this.nome = param.nome;
        this.preco = param.preco;
        this.descricao = param.descricao;
        this.quantidade = param.quantidade;
        this.status = param.status;
        this.limiar = param.limiar;

        if (this.nome == undefined || this.nome.length === 0) {
            throw {
                code: 1,
                name: "Campos faltantes",
                message: "O campo nome não foi enviado"
            }
        }

        if (this.preco == undefined || this.preco.length === 0) {
            throw {
                code: 1,
                name: "Campos faltantes",
                message: "O campo preco não foi enviado"
            }
        }
    }
}

module.exports = Produto;