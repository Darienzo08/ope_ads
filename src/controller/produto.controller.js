class ProdutoDAO {

    constructor(connection) {

        this._connection = connection
    }


    async listar() {

        const arrayProdutos = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT id_produto, nome_produto, preco_produto, descricao_produto, status_produto, qtd_produto FROM estoque_produto', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_product) => {

                        arrayProdutos.push({
                            id: raw_product.id_produto,
                            nome: raw_product.nome_produto,
                            preco: raw_product.preco_produto,
                            descricao: raw_product.descricao_produto,
                            status: raw_product.status_produto,
                            quantidade: raw_product.qtd_produto
                        });
                    });

                    resolve(arrayProdutos);
                }
            )

        })

    }

    async listar_id(id) {

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT * FROM estoque_produto WHERE id_produto = ?', [id],

                (error, results, fields) => {
                    if (error) return reject(error);

                    if (results.length > 0)

                        resolve({
                            id: results[0].id_produto,
                            nome: results[0].nome_produto,
                            preco: results[0].preco_produto,
                            descricao: results[0].descricao_produto,
                            status: results[0].status_produto,
                            quantidade: results[0].qtd_produto
                        });

                    else

                        reject({
                            code: 0,
                            msg: 'Nenhum produto encontrado'
                        });

                }
            )
        })

    }

    async cadastrar(produto) {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'INSERT INTO estoque_produto(nome_produto, preco_produto, descricao_produto) VALUES (?, ?, ?)',
                [produto.nome, produto.preco, produto.descricao],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        id: results.insertId,
                        nome: produto.nome,
                        preco: produto.preco,
                        descricao: produto.descricao
                    })
                }
            )
        })

    }

    async alterar(id, alteracao) {

        const produto = await this.listar_id(id)

        return new Promise((resolve, reject) => {

            if (alteracao.nome != null) produto.nome = alteracao.nome

            if (alteracao.preco != null) produto.preco = alteracao.preco

            if (alteracao.descricao != null) produto.descricao = alteracao.descricao

            this._connection.query(
                'UPDATE estoque_produto SET nome_produto=?, preco_produto=?, descricao_produto=? WHERE id_produto=?',
                [produto.nome, produto.preco, produto.descricao, id],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        id: id,
                        nome: produto.nome,
                        preco: produto.preco,
                        descricao: produto.descricao,
                        status: produto.status
                    })
                }
            )
        })
    }

    async alterar_status(id) {

        const produto = await this.listar_id(id)

        if (produto.status == 1) produto.status = 0;
        else produto.status = 1;

        return new Promise((resolve, reject) => {

            this._connection.query(
                'UPDATE estoque_produto SET status_produto=? WHERE id_produto=?',
                [produto.status, id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(produto)
                }
            )

        })

    }

    async entrada(id, qtd, price, idFornecedor) {

        const produto = await this.listar_id(id);

        return new Promise((resolve, reject) => {

            produto.quantidade += qtd;

            this._connection.query(
                'INSERT INTO estoque_entrada(produto_entrada, qtd_entrada, preco_entrada, id_fornecedor) VALUES(?, ?, ?, ?)',
                [produto.id, qtd, price, idFornecedor],

                (error, results, fields) => {
                    if (error) return reject(error.code)
                }
            )

            this._connection.query(
                'UPDATE estoque_produto SET qtd_produto = ? WHERE id_produto = ?',
                [produto.quantidade, id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(produto)
                }
            )
        })
    }

    async listarEntradaId(id) {

        return await new Promise((resolve, reject) => {
            this._connection.query(
                'SELECT * FROM estoque_entrada WHERE id_entrada = ?',
                [id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve({
                        id_entrada: results[0].id_entrada,
                        produto_entrada: results[0].produto_entrada,
                        qtd_entrada: results[0].qtd_entrada,
                        preco_entrada: results[0].preco_entrada,
                        id_fornecedor: results[0].id_fornecedor
                    })
                }
            )
        })
    }


    async retificarEntrada(id, idEntrada, price, idFornecedor, qtd) {

        const entrada = await this.listarEntradaId(idEntrada)

        const produto = {};

        return await new Promise((resolve, reject) => {

            this._connection.query(
                'UPDATE estoque_entrada SET qtd_entrada = ? , SET preco_entrada = ?, SET id_fornecedor = ?, SET alterado_entrada = 1 WHERE id_entrada = ?',
                [qtd, price, idFornecedor, idEntrada],

                (error, results, fields) => {
                    if (error) return reject(error.code)
                }
            )

            produto.quantidade = entrada.qtd_entrada;

            if (entrada.qtd_entrada > qtd) {
                produto.quantidade = entrada.qtd_entrada - qtd;
            }

            if (entrada.qtd_entrada < qtd) {
                produto.quantidade = entrada.qtd_entrada + qtd;
            }

            entrada.qtd_entrada = qtd;

            this._connection.query(
                'UPDATE estoque_produto SET qtd_produto = ? WHERE id_produto = ?',
                [produto.quantidade, id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(entrada)
                }
            )
        })
    }

    async saida(id, qtd) {

        const produto = await this.listar_id(id)

        return new Promise((resolve, reject) => {

            produto.quantidade -= qtd

            this._connection.query(
                'INSERT INTO estoque_saida(produto_saida, qtd_saida) VALUES(?, ?)',
                [id, qtd],

                (error, results, fields) => {
                    if (error) return reject(error)

                }
            )

            this._connection.query(
                'UPDATE estoque_produto SET qtd_produto = ? WHERE id_produto = ?',
                [produto.quantidade, id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(produto)
                }
            )
        });

    }

}

module.exports = ProdutoDAO;