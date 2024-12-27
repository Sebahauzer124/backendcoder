import express from "express";
import cardsRouter from "./routes/cards.router.js";
import productsRouter from "./routes/products.router.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import fs from "fs/promises"; 


const app = express();
const PORT = 8080;

// Crear el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});

// Crear la instancia de Socket.IO
const io = new Server(httpServer);

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Leer los productos del archivo JSON
const readProductsFile = async () => {
    try {
        const data = await fs.readFile('./src/data/productos.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo el archivo:", error);
        return [];
    }
};

// Escribir en el archivo JSON
const writeProductsFile = async (products) => {
    try {
        await fs.writeFile('./src/data/productos.json', JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Error escribiendo el archivo:", error);
    }
};


// Rutas
app.use("/api/cards", cardsRouter);
app.use("/api/products", productsRouter);

// Ruta principal
app.get("/", async (req, res) => {
    const products = await readProductsFile();
    res.render("home", { products });
});

// Ruta para "realTimeProducts"
app.get("/realtimeproducts", async (req, res) => {
    const products = await readProductsFile();
    res.render("realTimeProducts", { products });
});

// WebSocket: conexión
io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Emitir la lista inicial de productos
    readProductsFile().then((products) => {
        socket.emit("updateProducts", products);
    });

    // Escuchar eventos de creación de productos
    socket.on("createProduct", async (product) => {
        const products = await readProductsFile();
        products.push(product);
        await writeProductsFile(products);

        // Emitir la lista actualizada a todos los clientes
        io.emit("updateProducts", products);
    });

    // Escuchar eventos de eliminación de productos
    socket.on("deleteProduct", async (productId) => {
        let products = await readProductsFile();
        products = products.filter((p) => p.id !== productId);
        await writeProductsFile(products);

        // Emitir la lista actualizada a todos los clientes
        io.emit("updateProducts", products);
    });
});
