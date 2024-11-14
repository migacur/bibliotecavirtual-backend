const { response, request } = require("express");
const Books = require("../models/book-model");
const cloudinary = require('cloudinary').v2
const fs = require('fs-extra');

const mostrarLibro = async(req = request, res = response) => {

    const findBook = await Books.find({_id: req.params.id})

    if(!findBook){
        return res.status(400).json({
            msg: 'Error al mostrar el libro'
        });
    }

    return res.status(200).json(findBook)

}

const mostrarLibroCategoria = async(req = request, res = response) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;

    const count = await Books.countDocuments({categoria: req.params.categoria})

    const findBooks = await Books.find({categoria: req.params.categoria})
                      .skip((page -1) * pageSize)
                      .limit(pageSize);

        const response = {
            findBooks,
            currentPage: page,
            totalPages: Math.ceil(count / pageSize),
            bookCount : count
        }
      
    if(!findBooks){
        return res.status(400).json({
            msg: 'No hay libros para mostrar'
        });
    }

    return res.json(response)

}


const agregarLibro = async(req = request, res = response) => {

    if(!req.payload.id){
        return res.status(401).status({msg:"NO se pudo realizar esta acción"})
    }

    const result = await cloudinary.uploader.upload(req.file.path)

        try {

            const libro = await new Books(req.body)

            libro.imagen = result.url

            await libro.save()
            await fs.unlink(req.file.path)

            res.json(libro)
           
        } catch (error) {
            console.log(error);
        }

     
}

const actualizarLibro = async(req = request, res = response) => {

    const { id } = req.params;
    let nuevaData = req.body
   

    try {

        if(!req.payload.id){
            return res.status(401).status({msg:"NO se pudo realizar esta acción"})
        }

        const updateBook = await Books.findByIdAndUpdate({_id: id}, nuevaData)
        
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)
            updateBook.imagen = result.url
        }
        
        if(!updateBook){
            return res.status(400).json({
                msg: 'No existe libro con ese ID'
            })
        }
    
            updateBook.save()
            return res.json(updateBook) 
    
        } catch (error) {
        console.log(error)
    }

   

}

const borrarLibro = async(req = request, res = response) => {
  
    try {

        if(!req.payload.id){
            return res.status(404).json({msg: "No estás autorizado a realizar esta petición"})
        }

        const deleteBook = await Books.findOneAndDelete({_id : req.params.id})

        if(!deleteBook){
            return res.status(400).json({
                msg: 'Ocurrió un error al eliminar el libro'
            })
        }
    
            return res.status(200).json({
                msg: `Libro ${deleteBook.titulo} eliminado correctamente`
            })
    
        } catch (error) {
        console.log(error)
    }

   

}


const buscarLibro = async(req = request, res = response) => {

    const { libro } = req.params;
    
   const cadena = libro.normalize('NFD').replace(/[\u0300-\u036f]/g,"")

    const findbook = await Books.find(
        {titulo: {$regex: cadena, $options: 'i' }} )
   
    if(!findbook){
        return res.status(400).json({
            msg: 'No hay libros para mostrar'
        });
    }

    return res.json(findbook)
}

const showAllBooks = async(req=request, res=response) => {

    const showAll = await Books.find({})

    if(!showAll){
        return res.status(400).json({
            msg: 'Error al mostrar los libros'
        })
    }

    return res.json(showAll)
}

module.exports = {
    mostrarLibro,
    mostrarLibroCategoria,
    agregarLibro,
    actualizarLibro,
    borrarLibro,
    buscarLibro,
    showAllBooks
}