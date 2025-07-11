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

const mostrarLibroCategoria = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;
    const usuario = req.payload;

    if (!usuario) {
        return res.status(401).json({ msg: "Debes registrarte/ingresar para tener acceso a los libros" });
    }

    const categoria = req.params.categoria;

    try {
        // Optimización 1: Ejecutar count y find en paralelo
        const [count, findBooks] = await Promise.all([
            Books.countDocuments({ categoria }),
            Books.find({ categoria })
                .select('titulo autor imagen enlace _id') // Solo los campos necesarios
                .lean() // Convierte a objetos planos (más rápido)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
        ]);

        // Optimización 2: Manejo más eficiente de resultados vacíos
        if (count === 0) {
            return res.status(404).json({ msg: 'No hay libros en esta categoría' });
        }

        const response = {
            findBooks,
            currentPage: page,
            totalPages: Math.ceil(count / pageSize),
            bookCount: count
        };

        return res.json(response);

    } catch (error) {
        console.error('Error en mostrarLibroCategoria:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

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

   if(cadena.length < 3){
    return res.status(400).json({msg:"Tienes que ingresar al menos 3 caracteres"})
   }

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