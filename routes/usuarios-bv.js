const { Router } = require("express");
const { body } = require("express-validator");
const {
  crearCuentaBV,
  confirmarLogin,
  mostrarUser,
  mostrarUsuarios,
  agregarUsuarioFavoritos,
  mostrarFavoritos,
  borrarFavorito,
} = require("../controllers/usuario-controller");
const validarRoleBv = require("../middleware/IsAdmin");
const existeEmailBv = require("../validators/validar-email");
const existeUser = require("../validators/validar-user");
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
    body("usuario")
    .isLength({ min: 8 })
    .withMessage("El usuario debe tener al menos 8 caracteres")
    .matches(/^\S*$/)
    .withMessage("El nombre de usuario no debe contener espacios")
    .matches(
      /^(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z].*[A-Za-z].*[A-Za-z])[A-Za-z0-9]*$/
    )
    .withMessage("El nombre de usuario debe contener al menos 5 letras"),
  body("email")
    .isEmail()
    .withMessage("Debes ingresar un email válido")
    .normalizeEmail(),
    body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])/)
    .withMessage(
      "La contraseña debe incluir una letra mayúscula, un número y un caracter especial"
    ),
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
