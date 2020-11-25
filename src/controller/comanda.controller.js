const { raw } = require("body-parser");
const Comanda = require("../models/comanda.model");
const Itens = require("../models/itensComanda.model");

class ComandaDAO {

    constructor(connection) {
        this._connection = connection
    }

    async listarComanda() {

        const arrayComanda = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                // 'INNER JOIN estoque_itens_comanda AS eic ON estCom.id_comanda = eic.id_itens_comanda'

                'SELECT * FROM estoque_comanda ORDER BY status_comanda, data_comanda DESC', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_comanda) => {
                        arrayComanda.push({
                            idComanda: raw_comanda.id_comanda,
                            numMesa: raw_comanda.num_mesa,
                            valorComanda: raw_comanda.valor_comanda.toFixed(2),
                            statusComanda: raw_comanda.status_comanda,
                            dataComanda: new Date(raw_comanda.data_comanda),
                            //idItensComanda: raw_comanda.id_itens_comanda,
                            //idItens: raw_comanda.id_itens
                        })

                    });

                    resolve(arrayComanda)
                }

            )

        })

    };


    async listarItensComanda(idComanda) {

        const arrayItensComanda = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT et.id_item, et.nome_item, et.valor_item FROM estoque_itens_comanda INNER JOIN estoque_itens AS et ON et.id_item = id_itens WHERE id_comanda = ?',
                [idComanda],(error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_itens_comanda) => {
                        arrayItensComanda.push({
                            //idItensComanda: raw_itens_comanda.id_itens_comanda,
                            //idItens: raw_itens_comanda.id_itens,
                            idItem: raw_itens_comanda.id_item,
                            nomeItem: raw_itens_comanda.nome_item,
                            valorItem: raw_itens_comanda.valor_item
                        })

                    });

                    resolve(arrayItensComanda)
                }

            )

        })

    };

    async listar_Comanda_id(id) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'SELECT * FROM estoque_comanda WHERE id_comanda = ?',
                [id],

                (error, results, fields) => {

                    if(error) return reject(error);

                    if(results.length > 0)

                    resolve({
                        idComanda: results[0].id_comanda,
                        numMesa: results[0].num_mesa,
                        valorComanda: results[0].valor_comanda,
                        dataComanda: results[0].data_comanda,
                        statusComanda: results[0].status_comanda
                    });

                    else

                    reject({
                        code: 0,
                        msg: 'Nenhuma comanda encontrada'
                    });
                }
            )
        })
    }

 cadastrarComanda(comanda) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'INSERT INTO estoque_comanda(id_comanda, num_mesa, valor_comanda) VALUES (?, ?, ?)',
                [comanda.idComanda, comanda.numMesa, comanda.valorComanda],


                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        idComanda: comanda.idComanda,
                        numMesa: comanda.numMesa,
                        valorComanda: comanda.valorComanda
                    })
                }
            )

        })
    };

    async alterarComanda(id, alteracao) {

        const comanda = await this.listar_Comanda_id(id);

        return new Promise((resolve, reject) => {

            if (alteracao.numMesa != null) comanda.numMesa = alteracao.numMesa

            this._connection.query(
                'UPDATE estoque_comanda SET num_mesa=? WHERE id_comanda=?',
                [comanda.numMesa, id],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        idComanda: id,
                        numMesa: comanda.numMesa
                    })
                }
            )
        })
    };

    async finalizarComanda(id) {

        const comanda = await this.listar_Comanda_id(id)

        return new Promise((resolve, reject) => {

            this._connection.query(
                'UPDATE estoque_comanda SET status_comanda=? WHERE id_comanda=?',
                [1, id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(comanda)
                }
            )

        })

    }

    async listarItem(id) {

        return new Promise((resolve, reject) => {

            this._connection.query(
            'SELECT * FROM estoque_itens WHERE id_item = ?',
            [id],

            (error, results, fields) => {
                if (error) return reject(error)

                results.forEach((raw_item) => {

                    resolve({
                        id: raw_item.id_item,
                        nome: raw_item.nome_item,
                        valor: raw_item.valor_item,
                        produto: raw_item.produto_item,
                        status: raw_item.status_item
                    })

                })

            })

        })

    }

    async acrescentarComanda(comanda) {

        return new Promise(async (resolve, reject) => {

            const retorno = [];

            this._connection.query(
                'INSERT INTO estoque_itens_comanda(id_comanda, id_itens) VALUES (?, ?)',
                [comanda.idComanda, comanda.idItens],
                (error, results, fields) => { if (error) return reject(error) })

            const item = await this.listarItem(comanda.idItens);

            if (item.id == null) { resolve({msg: 'Item não encontrado'}) }

            if (item.produto != null) {

                this._connection.query(
                    'INSERT INTO estoque_saida(produto_saida, qtd_saida) VALUES(?, 1)',
                    [item.produto], (error, results, fields) => { if (error) return reject(error) }
                )

                this._connection.query(
                    'UPDATE estoque_produto SET qtd_produto = qtd_produto - 1 WHERE id_produto = ?',
                    [item.produto], (error, results, fields) => { if (error) return reject(error.code) }
                )

            }

            this._connection.query(
                'UPDATE estoque_comanda ' +
                'SET valor_comanda = valor_comanda + ? ' +
                'WHERE id_comanda = ?;',
                [item.valor, comanda.idComanda],
                (error, results, fields) => { if (error) return reject(error) })

            resolve({nomeItem: item.nome, valorItem: item.valor});

        })
    };

}

module.exports = ComandaDAO;