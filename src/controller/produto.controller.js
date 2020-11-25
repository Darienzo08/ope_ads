const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken');
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

class ProdutoDAO {

    constructor(connection) {

        this._connection = connection
    }

    async listar() {

        const arrayProdutos = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT id_produto, nome_produto, preco_produto, descricao_produto, status_produto, qtd_produto, limiar_produto FROM estoque_produto', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_product) => {

                        arrayProdutos.push({
                            id: raw_product.id_produto,
                            nome: raw_product.nome_produto,
                            preco: raw_product.preco_produto.toFixed(2),
                            descricao: raw_product.descricao_produto,
                            status: raw_product.status_produto,
                            quantidade: raw_product.qtd_produto,
                            limiar: raw_product.limiar_produto
                        });
                    });

                    resolve(arrayProdutos);
                }
            )

        })

    }

    async listarEntrada() {

        const arrayEntrada = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT id_entrada, prod.nome_produto, DATE_FORMAT(data_entrada, "%d/%m/%Y") AS data_entrada, qtd_entrada, preco_entrada, forn.nome_fornecedor FROM estoque_entrada AS ent ' +  
                'INNER JOIN estoque_produto AS prod ON prod.id_produto = ent.produto_entrada ' +
                'INNER JOIN estoque_fornecedores AS forn ON forn.cnpj_fornecedor = ent.id_fornecedor', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_entrada) => {

                        arrayEntrada.push({
                            idEntrada: raw_entrada.id_entrada,
                            nomeProduto: raw_entrada.nome_produto,
                            dataEntrada: raw_entrada.data_entrada,
                            quantidadeEntrada: raw_entrada.qtd_entrada,
                            precoEntrada: raw_entrada.preco_entrada,
                            nomeFornecedor: raw_entrada.nome_fornecedor
                        });
                    });

                    resolve(arrayEntrada);
                }
            )

        })

    }


    async listarSaida() {

        const arraySaida = [];

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT id_saida, prod.nome_produto, DATE_FORMAT(data_saida, "%d/%m/%Y") AS data_saida, qtd_saida FROM estoque_saida AS sai ' +
                'INNER JOIN estoque_produto AS prod ON prod.id_produto = sai.produto_saida', (error, results, fields) => {

                    if (error) return reject(error);

                    results.forEach((raw_saida) => {

                        arraySaida.push({
                            idSaida: raw_saida.id_saida,
                            nomeProduto: raw_saida.nome_produto,
                            produtoSaida: raw_saida.produto_saida,
                            dataSaida: raw_saida.data_saida,
                            quantidadeSaida: raw_saida.qtd_saida
                        });
                    });

                    resolve(arraySaida);
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
                'INSERT INTO estoque_produto(nome_produto, preco_produto, descricao_produto, limiar_produto) VALUES (?, ?, ?, ?)',
                [produto.nome, produto.preco, produto.descricao, produto.limiar],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        id: results.insertId,
                        nome: produto.nome,
                        preco: produto.preco,
                        descricao: produto.descricao,
                        limiar: produto.limiar
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

            if (alteracao.limiar != null) produto.limiar = alteracao.limiar

            this._connection.query(
                'UPDATE estoque_produto SET nome_produto=?, preco_produto=?, descricao_produto=?, limiar_produto=? WHERE id_produto=?',
                [produto.nome, produto.preco, produto.descricao, produto.limiar, id],

                (error, results, fields) => {
                    if (error) return reject(error)
                    resolve({
                        id: id,
                        nome: produto.nome,
                        preco: produto.preco,
                        descricao: produto.descricao,
                        limiar: produto.limiar,
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
                    if (error) return reject(error)
                }
            )

            this._connection.query(
                'UPDATE estoque_produto SET qtd_produto = ? WHERE id_produto = ?',
                [produto.quantidade, id],

                (error, results, fields) => {
                    if (error) return reject(error)

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
                    if (error) return reject(error)

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
                'UPDATE estoque_entrada SET qtd_entrada = ? , preco_entrada = ?, id_fornecedor = ? WHERE id_entrada = ?',
                [qtd, price, idFornecedor, idEntrada],

                (error, results, fields) => {
                    if (error) return reject(error)
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
                    if (error) return reject(error)

                    resolve(entrada)
                }
            )
        })
    }

    async listarSaidaId(id) {

        return await new Promise((resolve, reject) => {
            this._connection.query(
                'SELECT * FROM estoque_saida WHERE id_saida = ?',
                [id],

                (error, results, fields) => {
                    if (error) return reject(error)

                    resolve({
                        id_saida: results[0].id_saida,
                        produto_saida: results[0].produto_saida,
                        qtd_saida: results[0].qtd_saida,
                        data_saida: results[0].data_entrada
                    })
                }
            )
        })

    }

    async retificarSaida(id, idSaida, qtd) {

        const saida = await this.listarSaidaId(idSaida);

        const produto = {};

        return await new Promise((resolve, reject) => {

            this._connection.query(
                'UPDATE estoque_saida SET qtd_saida = ?, produto_saida = ? WHERE id_saida = ?',
                [qtd, id, idSaida],

                (error, results, fields) => {
                    if (error) return reject(error)
                }
            )

            produto.quantidade = saida.qtd_saida;

            if (saida.qtd_saida > qtd) {
                produto.quantidade = saida.qtd_saida - qtd;
            }

            if (saida.qtd_saida < qtd) {
                produto.quantidade = saida.qtd_saida + qtd;
            }

            saida.qtd_saida = qtd;

            this._connection.query(
                'UPDATE estoque_produto SET qtd_produto = ? WHERE id_produto = ?',
                [produto.quantidade, id],

                (error, results, fields) => {
                    if (error) return reject(error)

                    resolve(saida)
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

    async gerarSenha (senha) {

        return new Promise((resolve, reject) => {

            const salt = bcrypt.genSaltSync(10)

            const hash = bcrypt.hashSync(senha, salt)

            resolve({senha: hash})

        })

    }

    async realizarLogin (user, senha) {

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT * FROM estoque_login WHERE user_login = ?', [user], (error, results, fields) => {

                    if (error) return reject(error);

                    if (results.length < 1) { return reject({code: 1, name: "Não encontrado", message: "Nenhum usuário encontrado"}) }

                    const verified = bcrypt.compareSync(senha, results[0].senha_login);

                    if (verified == false) {return reject({code: 1, name: "Não encontrado", message: "Nenhum usuário encontrado"})} 

                    const id = results[0].id_login

                    const token = jwt.sign({ id }, process.env.SECRET, {expiresIn: 300});

                    this.gerarSessao(id, token);

                    resolve({ auth: true, token: token });
                        
                }

            )

        })

    }

    async gerarSessao (user, token) {

        this._connection.query(

            'INSERT INTO estoque_sessao (token_sessao, user_sessao) VALUES (?, ?)' +
            'ON DUPLICATE KEY UPDATE token_sessao = VALUES(token_sessao), user_sessao = VALUES(user_sessao)', [token, user], (error, results, fields) => {

                if (error) return error;
                    
            }

        )

    }

    async validarSessao (token) {

        return new Promise((resolve, reject) => {

            this._connection.query(

                'SELECT * FROM estoque.estoque_sessao WHERE token_sessao = ?', [token], (error, results, fields) => {

                    if (error) return reject(error);

                    if (results.length < 1) { return reject({auth: false, name: "Não encontrado", message: "Sessão não encontrada"}) }
                    
                    resolve({auth: true})

                }

            )

        })

    }

}

module.exports = ProdutoDAO;