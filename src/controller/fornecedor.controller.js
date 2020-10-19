const Fornecedor = require("../models/fornecedor.model");

class FornecedorDAO {

    constructor(connection) {
        this._connection = connection
    }

    async listarFornecedor() {

        const arrayFornecedor = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT cnpj_fornecedor, nome_fornecedor, endereco_fornecedor FROM estoque_fornecedores', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_fornecedor) => {
                        arrayFornecedor.push({
                            cnpj: raw_fornecedor.cnpj_fornecedor,
                            nomeFornecedor: raw_fornecedor.nome_fornecedor,
                            enderecoFornecedor: raw_fornecedor.endereco_fornecedor
                        })

                    });

                    resolve(arrayFornecedor)
                }

            )

        })

    };

    async listar_Fornecedor_id(id) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'SELECT * FROM estoque_fornecedores WHERE cnpj_fornecedor = ?',
                [id],

                (error, results, fields) => {

                    if(error) return reject(error);

                    if(results.length > 0)

                    resolve({
                        cnpj: results[0].cnpj_fornecedor,
                        nomeFornecedor: results[0].nome_fornecedor,
                        enderecoFornecedor: results[0].endereco_fornecedor
                    });

                    else

                    reject({
                        code: 0,
                        msg: 'Nenhum fornecedor encontrado'
                    });
                }
            )
        })
    }

    async cadastrarFornecedor(fornecedor) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'INSERT INTO estoque_fornecedores(cnpj_fornecedor, nome_fornecedor, endereco_fornecedor) VALUES (?, ?, ?)',
                [fornecedor.cnpj, fornecedor.nomeFornecedor, fornecedor.enderecoFornecedor],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        cnpj: fornecedor.cnpj,
                        nomeFornecedor: fornecedor.nomeFornecedor,
                        enderecoFornecedor: fornecedor.enderecoFornecedor
                    })
                }
            )
        })
    };

    async alterarFornecedor(id, alteracao) {

        const fornecedor = await this.listar_Fornecedor_id(id);

        return new Promise((resolve, reject) => {

            if (alteracao.nomeFornecedor != null) fornecedor.nomeFornecedor = alteracao.nomeFornecedor;

            if (alteracao.enderecoFornecedor != null) fornecedor.enderecoFornecedor = alteracao.enderecoFornecedor;

            this._connection.query(
                'UPDATE estoque_fornecedores SET nome_fornecedor=?, endereco_fornecedor=? WHERE cnpj_fornecedor=?',
                [fornecedor.nomeFornecedor, fornecedor.enderecoFornecedor, id],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        cnpj: id,
                        nomeFornecedor: fornecedor.nomeFornecedor,
                        enderecoFornecedor: fornecedor.enderecoFornecedor
                    })
                }
            )
        })
    };
}

module.exports = FornecedorDAO;