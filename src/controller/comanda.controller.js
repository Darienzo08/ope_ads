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

                'SELECT id_comanda, num_mesa, valor_comanda, status_comanda FROM estoque_comanda AS estCom ' +
                'INNER JOIN estoque_itens_comanda AS eic ON estCom.id_comanda = eic.id_itens_comanda', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_comanda) => {
                        arrayComanda.push({
                            idComanda: raw_comanda.id_comanda,
                            numMesa: raw_comanda.num_mesa,
                            valorComanda: raw_comanda.valor_comanda,
                            statusComanda: raw_comanda.status_comanda,
                            idItensComanda: raw_comanda.id_itens_comanda,
                            idItens: raw_comanda.id_itens
                        })

                    });

                    resolve(arrayComanda)
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

    async cadastrarComanda(comanda) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'INSERT INTO estoque_comanda(id_comanda, num_mesa, valor_comanda, status_comanda) VALUES (?, ?, ?, ?)',
                [comanda.idComanda, comanda.numMesa, comanda.valorComanda, comanda.statusComanda],


                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        idComanda: comanda.idComanda,
                        numMesa: comanda.numMesa,
                        valorComanda: comanda.valorComanda,
                        statusComanda: comanda.statusComanda
                    })
                }
            )
        })
    };

    async alterarComanda(id, alteracao) {

        const comanda = await this.listar_Comanda_id(id);

        return new Promise((resolve, reject) => {

            if (alteracao.numMesa != null) comanda.numMesa = alteracao.numMesa

            if (alteracao.valorComanda != null) comanda.valorComanda = alteracao.valorComanda

            if (alteracao.statusComanda != null) comanda.statusComanda = alteracao.statusComanda

            this._connection.query(
                'UPDATE estoque_comanda SET num_mesa=?, valor_comanda=?, status_comanda=? WHERE id_comanda=?',
                [comanda.numMesa, comanda.valorComanda, comanda.statusComanda, id],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        idComanda: id,
                        numMesa: comanda.numMesa,
                        valorComanda: comanda.valorComanda,
                        statusComanda: comanda.statusComanda
                    })
                }
            )
        })
    };

    async finalizarComanda(id) {

        const comanda = await this.listar_Comanda_id(id)

        if (comanda.statusComanda == 1) comanda.statusComanda = 0;
        else comanda.statusComanda = 1;

        return new Promise((resolve, reject) => {

            this._connection.query(
                'UPDATE estoque_comanda SET status_comanda=? WHERE id_comanda=?',
                [comanda.statusComanda, id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(comanda)
                }
            )

        })

    }

    async acrescentarComanda(id) {

    }
}

module.exports = ComandaDAO;