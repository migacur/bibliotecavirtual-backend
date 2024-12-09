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
const authCookieJWT = require('../middleware/authJwtCookie');
const bookRouter = Router()

bookRouter.get('/mostrar-libro/:id', [authCookieJWT,uploadFile,validarRoleBv], mostrarLibro)

bookRouter.get('/mostrar-libros', [authCookieJWT,validarRoleBv], showAllBooks)

bookRouter.get('/libros/:categoria', authCookieJWT, mostrarLibroCategoria)

bookRouter.post('/add-libro', [uploadFile, authCookieJWT, validarRoleBv] , agregarLibro)

bookRouter.put('/update-book/:id', [uploadFile, authCookieJWT, validarRoleBv], actualizarLibro)
 
bookRouter.delete('/delete-libro/:id', [authCookieJWT, validarRoleBv] , borrarLibro)

bookRouter.get('/buscar/:libro', authCookieJWT, buscarLibro)

module.exports = bookRouter