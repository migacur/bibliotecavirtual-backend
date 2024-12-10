const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bookRouter = require("./routes/books");
const usuarioRouter = require("./routes/usuarios-bv");
const uploadFile = require("./middleware/multerHelper");
const PORT = process.env.PORT || 3000;
const cloudinary = require("cloudinary").v2;
const fs = require("fs-extra");
const Users = require("./models/users-bv");
const cookieParser = require("cookie-parser");


// Configuración de CORS 
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

//ruta para subir imagen
app.post("/upload-image", uploadFile, async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);

  await fs.unlink(req.file.path);

  res.send("Imagen cargado");
});

app.post("/change-avatar/:id", uploadFile, async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);

  const usuario = await Users.findById({ _id: req.params.id });

  if (!usuario) {
    return res.status(400).json({
      msg: "Ha ocurrido un error",
    });
  }

  usuario.avatar = result.url;

  await usuario.save();

  await fs.unlink(req.file.path);

  res.send(result.url);
});

// middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bookRouter);
app.use(usuarioRouter);

app.get("/contacto", (_, res) => {
  res.render("contacto");
});

app.get("*", (_, res) => {
  res.status(404).send("Página no encontrada");
});

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  app.listen(PORT, () => {
    console.log(`Servidor montado en el puerto: ${PORT}`);
  });
};

connectDB();
