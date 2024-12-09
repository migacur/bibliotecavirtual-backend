const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCuentaBV,
  confirmarLogin,
  mostrarUser,
  mostrarUsuarios,
  agregarUsuarioFavoritos,
  mostrarFavoritos,
  borrarFavorito,
} = require("../controllers/usuario-controller");
const { validateResult } = require("../helpers/validateHelper");
const validarRoleBv = require("../middleware/IsAdmin");
const existeEmailBv = require("../validators/validar-email");
const existeUser = require("../validators/validar-user");
const validarLongitud = require("../validators/validarData");
const authCookieJWT = require("../middleware/authJwtCookie");
const usuarioRouter = Router();

usuarioRouter.get(
  "/usuarios",
  [authCookieJWT, validarRoleBv],
  mostrarUsuarios
);

usuarioRouter.get("/cuenta", authCookieJWT, mostrarUser);

usuarioRouter.post(
  "/crear-cuenta",
  [
    existeUser,
    existeEmailBv,
    validarLongitud,
    check("email", "Ingresa un correo electrónico válido").isEmail(),
    validateResult,
  ],
  crearCuentaBV
);

usuarioRouter.post("/loginaccount", confirmarLogin);

usuarioRouter.post(
  "/usuario-favoritos/:id",
  authCookieJWT,
  agregarUsuarioFavoritos
);

usuarioRouter.get("/mostrarfavoritos/:id", authCookieJWT, mostrarFavoritos);

usuarioRouter.put("/borrar-favorito/:id", authCookieJWT, borrarFavorito);

usuarioRouter.get("/verify", authCookieJWT, (req, res) => {
  res.json(req.payload);
});

module.exports = usuarioRouter;
