const { response, request } = require("express");
const Categorias = require("../models/categoria-model");


const obtenerCategorias = async(req, res = response) => {
    
    const mostrar = await Categorias.find( {} )

    if(!mostrar){

        return res.status(400).json({
            msg: 'No hay categorías para mostrar'
        });
    
    }
    
        return res.json(mostrar);
 
}

const mostrarCategoria = async(req, res = response) => {

    const { id } = req.params

    const buscar = await Categorias.findById( id )

    if(buscar){
        return res.json({
            buscar
        })
    }
        return res.status(400).json({
            msg: 'La categoría no existe'
        })

           
}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaBD = await Categorias.findOne({ nombre });

    if( categoriaBD ){
        return res.status(400).json({
            msg: `La categoría ${ categoriaBD.nombre }, ya existe`
        });
    }

    if( !req.usuario ){
        return res.status(400).json({
            msg: `El usuario no se encuentra en la BBDD`
        })
    }

    const data = {
        nombre,
        user: req.usuario._id,
    }

    console.log( data )
    const categoria = new Categorias( data );

    await categoria.save()

    res.json({
        categoria
    })
}

const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const { nombre, estado, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = data.usuario._id;


    const actualizarData = await Categorias
                           .findByIdAndUpdate(id, data)


    await actualizarData.save()

    res.json({
        actualizarData
    })
    
}

const eliminarCategoria = async(res = response, req= request) => {

        const { id } = req.params;

         const categoriaOff = await Categorias
                                    .findByIdAndUpdate(id, {estado: false})
    
        return res.json({
            categoriaOff
        })
        
}

module.exports = {
    obtenerCategorias,
    mostrarCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}