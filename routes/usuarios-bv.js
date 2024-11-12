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
  enviarCorreo,
  enviarCodigo,
  confirmarCorreo,
  codeConfirmEmail,
} = require("../controllers/usuario-controller");
const { validateResult } = require("../helpers/validateHelper");
const validarRoleBv = require("../middleware/IsAdmin");
const authVerifyToken = require("../middleware/validarExpJWT");
const existeEmailBv = require("../validators/validar-email");
const existeUser = require("../validators/validar-user");
const validarLongitud = require("../validators/validarData");
const usuarioRouter = Router();

usuarioRouter.get(
  "/usuarios",
  [authVerifyToken, validarRoleBv],
  mostrarUsuarios
);

usuarioRouter.get("/cuenta", authVerifyToken, mostrarUser);

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
  authVerifyToken,
  agregarUsuarioFavoritos
);

usuarioRouter.get("/mostrarfavoritos/:id", authVerifyToken, mostrarFavoritos);

usuarioRouter.put("/borrar-favorito/:id", authVerifyToken, borrarFavorito);

usuarioRouter.post("/forgot-password", enviarCorreo);

usuarioRouter.post("/reset-password", enviarCodigo);

usuarioRouter.put("/confirmar-correo/:id", authVerifyToken, confirmarCorreo);

usuarioRouter.put("/codigo-confirmacion", authVerifyToken, codeConfirmEmail);

usuarioRouter.get("/verify", authVerifyToken, (req, res) => {
  res.json(req.payload);
});

module.exports = usuarioRouter;
