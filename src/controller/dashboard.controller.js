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

                'SELECT COUNT(*) AS valor FROM estoque_comanda WHERE MONTH(data_comanda) = MONTH(NOW())', (error, results, fields) => {

                    if (error) return reject(error);

                    resolve(results)
                }

            )

        })
    }

    async listarValorRecebido() {

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT SUM(valor_comanda) AS valor FROM estoque_comanda WHERE MONTH(data_comanda) = MONTH(NOW())', (error, results, fields) => {

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

                'SELECT nome_produto, qtd_produto, limiar_produto, status_produto FROM estoque_produto WHERE qtd_produto < limiar_produto AND status_produto = 1', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_product) => {

                        arrayProdutos.push({
                            nome: raw_product.nome_produto,
                            quantidade: raw_product.qtd_produto,
                            limiar: raw_product.limiar_produto,
                            status: raw_product.status_produto,
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

                'SELECT produto_entrada, nome_produto, prod.status_produto, qtd_entrada, data_entrada, forn.nome_fornecedor FROM estoque_entrada AS ent ' +
                'INNER JOIN estoque_produto AS prod ON prod.id_produto = ent.produto_entrada ' +
                'INNER JOIN estoque_fornecedores AS forn ON forn.cnpj_fornecedor = ent.id_fornecedor ' +
                'WHERE MONTH(data_entrada) = MONTH(NOW()) AND prod.status_produto = 1 order by data_entrada desc LIMIT 10', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_entrada) => {

                        arrayEntrada.push({
                            nomeProduto: raw_entrada.nome_produto,
                            produtoEntrada: raw_entrada.produto_entrada,
                            quantidadeEntrada: raw_entrada.qtd_entrada,
                            data_entrada: raw_entrada.data_entrada,
                            nomeFornecedor: raw_entrada.nome_fornecedor,
                            status: raw_entrada.status_produto,
                        });
                    });

                    resolve(arrayEntrada);

                }
            )
        })
    }

    async listarValorGasto() {

        const arrayValoresGastos = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                "CREATE TEMPORARY TABLE dados SELECT * FROM ( " +

                    "SELECT SUM(valor_comanda) AS 'vendas', DATE(data_comanda) AS 'data_venda', NULL AS 'gastos', NULL AS 'data_gasto' FROM estoque_comanda " +
                    
                    "GROUP BY data_venda " + "UNION ALL " +
                    
                    "SELECT NULL AS 'vendas', NULL AS 'data_venda', SUM(preco_entrada) AS 'gastos', DATE(data_entrada) AS 'data_gasto' FROM estoque_entrada " +
                    
                    "GROUP BY data_gasto) AS vg; ", (error, results, fields) => {

                    if (error) return reject(error);

                }
            )

            this._connection.query(

                "UPDATE dados SET " +
                "data_gasto = CASE " +
                "    WHEN data_gasto IS NOT NULL THEN data_gasto " +
                "    ELSE data_venda " +
                "END, " +
                "data_venda = CASE " +
                "    WHEN data_venda IS NOT NULL THEN data_venda " +
                "    ELSE data_gasto " +
                "END;", (error, results, fields) => {

                    if (error) return reject(error);

                }
            )

            this._connection.query(

                "SELECT IFNULL(SUM(vendas),0) AS 'vendas', IFNULL(SUM(gastos),0) AS 'gastos' , data_venda AS 'data' FROM dados " +
                "GROUP BY data_venda, data_gasto ORDER BY data DESC LIMIT 7; ", (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_dados) => {

                        arrayValoresGastos.push({
                            vendas: raw_dados.vendas.toFixed(2),
                            gastos: raw_dados.gastos.toFixed(2),
                            data: raw_dados.data
                        })

                    })

                    resolve(arrayValoresGastos);

                }
            )

            this._connection.query(

                "DROP TEMPORARY TABLE dados;", (error, results, fields) => {

                    if (error) return reject(error);

                }
            )

        })
    }
}

module.exports = DashDao;