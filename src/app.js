import express from "express";
import cardsRouter from "./routes/cards.router.js";
import productsRouter from "./routes/products.router.js";


const app = express();
const PUERTO = 8080;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/api/cards", cardsRouter);
app.use("/api/products", productsRouter);

app.listen(PUERTO, () => {
    console.log(`Servidor http escuchando en el puerto ${PUERTO}`);
});