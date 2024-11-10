const { Router } = require('express')
const { agregarLibro, 
        mostrarLibroCategoria, 
        borrarLibro, 
        buscarLibro, 
        actualizarLibro,
        mostrarLibro,
        showAllBooks} = require('../controllers/book-controller');
const validarRoleBv = require('../middleware/IsAdmin');
const uploadFile = require('../middleware/multerHelper');
const authVerifyToken = require('../middleware/validarExpJWT');
const bookRouter = Router()

bookRouter.get('/mostrar-libro/:id', [authVerifyToken,uploadFile,validarRoleBv], mostrarLibro)

bookRouter.get('/mostrar-libros', [authVerifyToken,validarRoleBv], showAllBooks)

bookRouter.get('/libros/:categoria', authVerifyToken, mostrarLibroCategoria)

bookRouter.post('/add-libro', [uploadFile, authVerifyToken, validarRoleBv] , agregarLibro)

bookRouter.put('/update-book/:id', [uploadFile, authVerifyToken, validarRoleBv], actualizarLibro)
 
bookRouter.delete('/delete-libro/:id', [authVerifyToken, validarRoleBv] , borrarLibro)

bookRouter.get('/buscar/:libro', authVerifyToken, buscarLibro)

module.exports = bookRouter