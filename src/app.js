import express from "express";
import exphbs from "express-handlebars"; // Importa exphbs en lugar de handlebars
import mongoose from "mongoose";


// Rutas
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"


// Crear la instancia de express
const app = express();
const PUERTO = 8080;

// Conexión a MongoDB
const MONGO_URI = "mongodb+srv://sebahauzer124:coderhouse@cluster0.s6a7q.mongodb.net/entregaFinal?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

// Middleware
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos URL-encoded
app.use(express.json()); // Middleware para parsear JSON
app.use(express.static("./src/public")); // Middleware para archivos estáticos

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views"); // Ruta de las vistas

// Rutas
app.use("/api/products", productsRouter); // Endpoints para productos
app.use("/api/carts", cartsRouter); // Endpoints para carritos
app.use("/", viewsRouter);

// Iniciar el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
