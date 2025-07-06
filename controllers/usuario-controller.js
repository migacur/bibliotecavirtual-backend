const { response, request } = require("express");
const Users = require("../models/users-bv");
const bcrypt = require("bcrypt");
const Books = require("../models/book-model");
const generarToken = require("../helpers/generarToken");
const { validationResult } = require("express-validator");

const mostrarUsuarios = async (req = request, res = response) => {
  try {
    const usuarios = await Users.find({}).populate("favoritos");

    if (!usuarios) {
      return res.status(400).json({
        msg: "No se encontraron usuarios",
      });
    }

    return res.json(usuarios);
  } catch (error) {
    return res.status(400).json({
      msg: "Ha ocurrido un error al mostrar los usuarios",
    });
  }
};

const mostrarUser = async (req = request, res = response) => {
  try {
    if (!req.payload) {
      return res.status(401).json({ msg: "Acceso Denegado" });
    }

    const user = await Users.findById({ _id: req.payload.id });

    if (!user) {
      return res.status(400).json({
        msg: "Este usuario no existe o no está habilitado",
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    return res.status(401).json({
      msg: "Error al acceder al perfil del usuario",
    });
  }
};

const crearCuentaBV = async (req = request, res = response) => {
  const { usuario, email, password, repeat } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (password !== repeat) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden",
      });
    }

    const user = await new Users({ usuario, email, password });

    const hashPassword = bcrypt.genSaltSync(6);
    user.password = bcrypt.hashSync(password, hashPassword);

    await user.save();

    return res.json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Hubo un error, contacte con el administrador de la web",
    });
  }
};

const confirmarLogin = async (req = request, res = response) => {
  const { usuario, password } = req.body;

  try {
    if (!usuario || !password) {
      return res.status(404).json({
        msg: "Usuario y Password son campos obligatorios",
      });
    }

    const nuevoUsuario = await Users.findOne({ usuario });

    if (!nuevoUsuario) {
      return res.status(404).json({
        msg: `El usuario ${usuario} no se encuentra registrado`,
      });
    }

    // Verificar la contraseña
    bcrypt.compare(password, usuario.passwordHash).then((esValido) => {
      if (!esValido) {
        return res.status(400).json({
          msg: "La contraseña es incorrecta",
        });
      }
    });

    const token = await generarToken(nuevoUsuario);

    res.cookie("token_de_acceso", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    const userInfo = {
      _id: nuevoUsuario._id,
      avatar: nuevoUsuario.avatar,
      favoritos: nuevoUsuario.favoritos,
    };

    return res.json({ userInfo });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Hubo un error, contacte con el administrador de la web",
    });
  }
};

const agregarUsuarioFavoritos = async (req = request, res = response) => {
  try {
    const userID = req.params.id;
    const bookID = req.body;

    const user = await Users.findById(userID);
    const book = await Books.findById(bookID);

    if (userID !== req.payload.id) {
      return res.status(400).json({
        msg: "Se ha producido un error al realizar esta acción.",
      });
    }

    if (user.favoritos.includes(bookID) || book.favoriteOf.includes(userID)) {
      return res.status(400).json({
        msg: "Este libro ya se encuentra en tus favoritos.",
      });
    }

    if (user.favoritos.length === 20) {
      return res.status(400).json({
        msg: "NO puedes agregar más de 20 libros a favoritos.",
      });
    }

    user.favoritos.push(bookID);
    await user.save();
    book.favoriteOf.push(userID);
    await book.save();

    return res.status(200).json({
      msg: "El libro se agregó a favoritos",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error, contacte con el administrador...",
    });
  }
};

const mostrarFavoritos = async (req = request, res = response) => {
  const { id } = req.params;

  const user = await Users.findById({ _id: id }).populate("favoritos", {
    titulo: 1,
    imagen: 1,
    enlace: 1,
    categoria: 1,
  });

  if (id !== req.payload.id) {
    return res.status(400).json({
      msg: "Se ha producido un error al realizar esta acción.",
    });
  }

  if (!user) {
    return res.status(400).json({
      msg: "Error al mostrar los datos",
    });
  }
  res.json(user.favoritos);
};

const borrarFavorito = async (req = request, res = response) => {
  try {
    const userID = req.params.id;
    const bookID = req.body;

    const user = await Users.findOneAndUpdate(
      { _id: userID },
      { $pull: { favoritos: bookID._id } }
    );
    await user.save();
    const book = await Books.findOneAndUpdate(
      { _id: bookID },
      { $pull: { favoriteOf: userID } }
    );
    await book.save();

    if (!user || !book) {
      return res.status(400).json({
        msg: "Ocurrió un error al eliminar el libro",
      });
    }

    return res.status(200).json({
      msg: "El libro se eliminó correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error, contacte con el administrador...",
    });
  }
};

module.exports = {
  mostrarUsuarios,
  mostrarUser,
  crearCuentaBV,
  confirmarLogin,
  agregarUsuarioFavoritos,
  mostrarFavoritos,
  borrarFavorito,
};
