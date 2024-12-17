import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const cardsRouter = Router();

// Ruta del archivo JSON donde se guardan los carritos
const cardsFilePath = path.resolve("src", "data", "carrito.json");

// Función para leer el archivo de carritos
const readCardsFile = async () => {
    try {
        const data = await fs.readFile(cardsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo el archivo:", error);
        return [];
    }
};

// Función para escribir en el archivo de carritos
const writeCardsFile = async (cards) => {
    try {
        await fs.writeFile(cardsFilePath, JSON.stringify(cards, null, 2), "utf-8");
    } catch (error) {
        console.error("Error escribiendo en el archivo:", error);
    }
};

// ** Ruta GET / - Listar todos los carritos **
cardsRouter.get("/", async (req, res) => {
    try {
        const cards = await readCardsFile();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al obtener los carritos." });
    }
});

// ** Ruta GET /:cid - Obtener productos de un carrito por ID **
cardsRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cards = await readCardsFile();
        const card = cards.find((c) => c.id === cid);

        if (!card) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(card.products);
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al obtener el carrito." });
    }
});

// ** Ruta POST /:cid/product/:pid - Agregar un producto a un carrito **
cardsRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cards = await readCardsFile();
        const card = cards.find((c) => c.id === cid);

        if (!card) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productIndex = card.products.findIndex((p) => p.product === pid);

        if (productIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            card.products[productIndex].quantity += 1;
        } else {
            // Si el producto no existe, agregarlo con cantidad 1
            card.products.push({ product: pid, quantity: 1 });
        }

        await writeCardsFile(cards);
        res.json({ message: "Producto agregado con éxito", carrito: card });
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al agregar el producto al carrito." });
    }
});

// ** Ruta POST / - Crear un nuevo carrito **
cardsRouter.post("/", async (req, res) => {
    try {
        const cards = await readCardsFile();

        // Generar un ID único para el nuevo carrito
        const newId = cards.length > 0 ? String(Number(cards[cards.length - 1].id) + 1) : "1";

        // Crear un nuevo carrito con estructura inicial
        const newCard = {
            id: newId,
            products: []
        };

        // Agregar el nuevo carrito a la lista de carritos
        cards.push(newCard);

        // Guardar los cambios en el archivo
        await writeCardsFile(cards);

        res.status(201).json({ message: "Carrito creado con éxito", carrito: newCard });
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al crear el carrito." });
    }
});

export default cardsRouter;
