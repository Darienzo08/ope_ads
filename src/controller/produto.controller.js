class ProdutoDAO {

    constructor(connection) {

        this._connection = connection
    }


    async listar() {

        const arrayProdutos = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT estoque_produto.id_produto, nome_produto, preco_produto, descricao_produto, status_produto, estoque_qtd.qtd_produto FROM estoque_produto INNER JOIN estoque_qtd ON estoque_qtd.id_produto = estoque_produto.id_produto', (error, results, fields) => {
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
                            status: results[0].status_produto
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

                    this._connection.query(
                        'INSERT INTO estoque.estoque_qtd (id_produto, qtd_produto) VALUES (?, ?)',
                        [results.insertId, 0],

                        (error, results, fields) => {
                            if (error) return reject(error)
                        }
                    )
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

    async quantidade_produto(id) {

        const produto = await this.listar_id(id)
        let qtd = 0;

        return new Promise((resolve, reject) => {

            this._connection.query(
                'SELECT * FROM estoque_qtd WHERE id_produto = ?', [id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    if (results.length > 0) qtd = results[0].qtd_produto

                    resolve({
                        id: id,
                        produto: produto.nome,
                        quantidade: qtd
                    })
                }
            )
        })

    }

    async entrada(id, qtd) {

        const qtdProduto = await this.quantidade_produto(id)

        return new Promise((resolve, reject) => {

            qtdProduto.quantidade += qtd;

            this._connection.query(
                'INSERT INTO estoque_entrada(produto_entrada, qtd_entrada) VALUES(?, ?)',
                [qtdProduto.id, qtd],

                (error, results, fields) => {
                    if (error) return reject(error.code)
                }
            )

            this._connection.query(
                'UPDATE estoque_qtd SET qtd_produto = ? WHERE id_produto = ?',
                [qtdProduto.quantidade, qtdProduto.id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(qtdProduto)
                }
            )

        })

    }

    async saida(id, qtd) {

        const quantidadeProduto = await this.quantidade_produto(id);

        return new Promise((resolve, reject) => {

            quantidadeProduto.quantidade -= qtd

            this._connection.query(
                'INSERT INTO estoque_saida(produto_saida, qtd_saida) VALUES(?, ?)',
                [id, qtd],

                (error, results, fields) => {
                    if (error) return reject(error)

                }
            )

            this._connection.query(
                'UPDATE estoque_qtd SET qtd_produto = ? WHERE id_produto = ?',
                [quantidadeProduto.quantidade, quantidadeProduto.id],

                (error, results, fields) => {
                    if (error) return reject(error.code)

                    resolve(quantidadeProduto)
                }
            )
        });

    }

}

module.exports = ProdutoDAO;