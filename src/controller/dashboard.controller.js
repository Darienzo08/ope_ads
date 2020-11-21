class DashDao {

    constructor(connection) {
        this._connection = connection
    }

    async listarQuantidadeProdutos() {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'SELECT SUM(qtd_entrada) AS qtd FROM estoque_entrada WHERE MONTH(data_entrada) = MONTH(NOW())', (error, results, fields) => {

                    if (error) return reject(error);

                    resolve(results)
                })
        })
    }

    async listarPrecoTotalProduto() {

        return new Promise((resolve, reject) => {

            this._connection.query(
                'SELECT SUM(preco_entrada) AS preco FROM estoque_entrada WHERE MONTH(data_entrada) = MONTH(NOW())', (error, results, fields) => {

                    if (error) return reject(error);

                    resolve(results)

                }
            )
        })
    }

    async listarVendasTotal() {

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT SUM(valor_comanda) AS valor FROM estoque_comanda WHERE MONTH(data_comanda) = MONTH(NOW())', (error, results, fields) => {

                    if (error) return reject(error);

                    resolve(results)
                }

            )

        })
    }

    async listarValorRecebido() {

        return new Promise((resolve, reject) => {

            //WHERE MONTH(data_comanda) = MONTH(NOW())

            this._connection.query(

                'SELECT SUM(valor_comanda) AS valor FROM estoque_comanda', (error, results, fields) => {

                    if (error) return reject(error);

                    resolve(results)
                }

            )
        })
    }

    async listarProdutosAbaixoLimiar() {

        const arrayProdutos = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT nome_produto, qtd_produto, limiar_produto FROM estoque_produto WHERE qtd_produto < limiar_produto', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_product) => {

                        arrayProdutos.push({
                            nome: raw_product.nome_produto,
                            quantidade: raw_product.qtd_produto,
                            limiar: raw_product.limiar_produto
                        });
                    });

                    resolve(arrayProdutos);
                }
            )

        })
    }

    async listarUltimosProdutosComprados() {

        const arrayEntrada = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT produto_entrada, prod.nome_produto, qtd_entrada, id_fornecedor FROM estoque_entrada AS ent ' +  
                'INNER JOIN estoque_produto AS prod ON prod.id_produto = ent.produto_entrada ' +
                'INNER JOIN estoque_fornecedores AS forn ON forn.cnpj_fornecedor = ent.id_fornecedor  WHERE MONTH(data_entrada) = MONTH(NOW()) order by produto_entrada desc LIMIT 5', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_entrada) => {

                        arrayEntrada.push({
                            nomeProduto: raw_entrada.nome_produto,
                            produtoEntrada: raw_entrada.produto_entrada,
                            quantidadeEntrada: raw_entrada.qtd_entrada,
                            nomeFornecedor: raw_entrada.nome_fornecedor
                        });
                    });

                    resolve(arrayEntrada);

                }
            )
        })
    }
}

module.exports = DashDao;