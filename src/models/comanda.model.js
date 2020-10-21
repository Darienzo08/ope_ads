class Comanda {

    constructor(param) {

        this.idComanda = param.idComanda;
        this.numMesa = param.numMesa;
        this.valorComanda = param.valorComanda;
        this.statusComanda = param.statusComanda
    }
}

module.exports = Comanda;