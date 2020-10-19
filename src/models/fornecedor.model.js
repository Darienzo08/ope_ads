class Fornecedor {
    constructor(param) {

        this.cnpj = param.cnpj;
        this.nomeFornecedor = param.nomeFornecedor;
        this.enderecoFornecedor = param.enderecoFornecedor
    }
}

module.exports = Fornecedor;