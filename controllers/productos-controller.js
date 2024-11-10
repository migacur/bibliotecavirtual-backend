const { response, request } = require("express");
const Ecommerce = require("../models/commerce-model");


const mostrar_productos = async(req = request, res = response) => {

    const mostrar = await Ecommerce.find( {} )
    
    if(!mostrar){

        return res.status(400).json({
            msg: 'No hay categorías para mostrar'
        });
    
    }
    console.log(mostrar)
        return res.json(mostrar);
 
}

const agregar_productos = async(req = request, res = response) => {

    const { nombre, foto, precio } = req.body


    const nuevoProducto = await new Ecommerce({ 
                                            nombre,
                                            foto,
                                            precio
                                             })
             

    await nuevoProducto.save()
    
    res.json(nuevoProducto)
 
}

module.exports = {
    mostrar_productos,
    agregar_productos
}