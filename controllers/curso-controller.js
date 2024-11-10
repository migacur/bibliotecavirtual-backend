const { response } = require('express');
const { request } = require('express');

const showCurses = (req = request, res = response) => {
    const { id } = req.params
    const buscarId = data.filter(dato => dato.id == id)

    if(buscarId.length > 0){
        return res.send(buscarId)
    }
    return res.status(404).send('No encontrado')
} 

const changeAllData = (req = request, res = response) => {
    const { id } = req.params;
    const { curso, dificultad, horas } = req.body 
    const changeData = data.findIndex(dato => dato.id === id)

    if(!id || !curso || !dificultad || !horas){
        return res.status(404).send('Datos Inválidos')
    }

    if(id > data.length || id < 1){
        return res.status(404).send('ID no válido')
    }

    const datos = data.map(dato => {

        if(dato.id === parseInt(id)){
            const endData = dato[changeData] = req.body
            return endData
        }else{
            return dato;
        }
    })
    res.send(datos)
}

const changeData = (req = request, res = response) => {
    const { id } = req.params;
    const { body } = req;

    const existsId = data.filter(dato => dato.id === parseInt(id))
    
    if(existsId.length === 0){
        return res.status(404).send('ID no encontrado')
    }

    if(!body){
        return res.status(404).send('Datos no válidos')
    }

    const datos = data.map(dato => {
        if(dato.id === parseInt(id)){
            const endData = dato = {...dato, ...body}
            return endData
        }else{
            return dato;
        }
        
    })
    res.send(datos)
    
}

module.exports = {
    showCurses,
    changeAllData,
    changeData
}