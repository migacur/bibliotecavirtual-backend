const { response, request } = require("express");
const Favorite = require("../models/favorite-model");

const mostrarFavoritos = async(req=request, res=response) => {

    const mostrar = await Favorite.find({}).populate('libro');

    if(!mostrar){
        return res.status(400).json({
            msg: 'No encontrado'
        })
    }

    res.json(mostrar)
}

module.exports = {
    mostrarFavoritos
}