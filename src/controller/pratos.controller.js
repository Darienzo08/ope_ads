const Pratos = require("../models/estoqueItens.model");

class PratosDAO {

    constructor(connection) {
        this._connection = connection
    }

    async listarPratos() {

        const arrayPratos = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT id_item, nome_item, valor_item, produto_item, status_item FROM estoque_itens', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_prato) => {
                        arrayPratos.push({
                            idItem: raw_prato.id_item,
                            nomeItem: raw_prato.nome_item,
                            valorItem: raw_prato.valor_item,
                            produtoItem: raw_prato.produto_item,
                            statusItem: raw_prato.status_item
                        })

                    });

                    resolve(arrayPratos)
                }

            )

        })

    };

    async listar_pratos_id(id) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'SELECT * FROM estoque_itens WHERE id_item = ?',
                [id],

                (error, results, fields) => {

                    if(error) return reject(error);

                    if(results.length > 0)

                    resolve({
                        idItem: results[0].id_item,
                        nomeItem: results[0].nome_item,
                        valorItem: results[0].valor_item,
                        produtoItem: results[0].produto_item,
                        statusItem: results[0].status_item
                    });

                    else

                    reject({
                        code: 0,
                        msg: 'Nenhum prato encontrado'
                    });
                }
            )
        })
    }

    async cadastrarPratos(prato) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'INSERT INTO estoque_itens(nome_item, valor_item, produto_item, status_item) VALUES (?, ?, ?, ?)',
                [prato.nomeItem, prato.valorItem, prato.produtoItem, prato.statusItem],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        idItem: prato.idItem,
                        nomeItem: prato.nomeItem,
                        valorItem: prato.valorItem,
                        produtoItem: prato.produtoItem,
                        statusItem: prato.statusItem
                    })
                }
            )
        })
    };

    async alterarPratos(id, alteracao) {

        const prato = await this.listar_pratos_id(id);

        return new Promise((resolve, reject) => {

            if (alteracao.nomeItem != null) prato.nomeItem = alteracao.nomeItem;

            if (alteracao.valorItem != null) prato.valorItem = alteracao.valorItem;

            if (alteracao.produtoItem != null) prato.produtoItem = alteracao.produtoItem;

            this._connection.query(
                'UPDATE estoque_itens SET nome_item=?, valor_item=?, produto_item=? WHERE id_item=?',
                [prato.nomeItem, prato.valorItem, prato.produtoItem, id],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        nomeItem: prato.nomeItem,
                        valorItem: prato.valorItem,
                        produtoItem: id
                    })
                }
            )
        })
    };

    async inativarPratos(id) {

        const prato = await this.listar_pratos_id(id)

        if (prato.statusItem == 1) prato.statusItem = 0;
        else prato.statusItem = 1;

        return new Promise((resolve, reject) => {

            this._connection.query(
                'UPDATE estoque_itens SET status_item=? WHERE id_item=?',
                [prato.statusItem, id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(prato)
                }
            )

        })

    };
}

module.exports = PratosDAO;