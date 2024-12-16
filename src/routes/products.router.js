import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const productsRouter = Router();

// Usar path.resolve para obtener la ruta absoluta
const productsFilePath = path.resolve("src", "data", "productos.json");

// Función para leer el archivo JSON
const readProductsFile = async () => {
    try {
        const data = await fs.readFile(productsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo el archivo:", error);
        return []; // Retorna un arreglo vacío si no existe el archivo o hay un error
    }
};

const writeProductsFile = async (products) => {
    try {
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Error escribiendo el archivo:", error);
    }
};

// ** Ruta GET / - Listar todos los productos con limitación opcional **
productsRouter.get("/", async (req, res) => {
    try {
        const products = await readProductsFile();
        const { limit } = req.query; // Obtener el parámetro 'limit' de la URL

        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit)); // Limitar los productos
            return res.json(limitedProducts);
        }

        res.json(products); // Devuelve el listado completo de productos en formato JSON
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al obtener los productos." });
    }
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const products = await readProductsFile();
        const product = products.find(product => product.id === req.params.pid);
        res.json(product);
    } catch {
        res.status(404).json({ error: "Producto no encontrado." });
    }
});

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios excepto thumbnails" });
    }

    const products = await readProductsFile();

    // Crear un nuevo producto con un ID único
    const newProduct = {
        id: (products.length + 1).toString(), // Genera un ID único
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails,
    };

    products.push(newProduct);
    await writeProductsFile(products);

    res.status(201).json({ status: "success", message: "Producto creado", product: newProduct });
});

productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const products = await readProductsFile();
        const productIndex = products.findIndex((product) => product.id === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Eliminar el producto del arreglo
        const deletedProduct = products.splice(productIndex, 1);

        await writeProductsFile(products);
        res.json({ message: "Producto eliminado con éxito", product: deletedProduct[0] });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Hubo un problema al eliminar el producto" });
    }
});

productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updateFields = req.body;

    try {
        const products = await readProductsFile();
        const productIndex = products.findIndex((product) => product.id === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Actualizar los campos sin modificar el ID
        const updatedProduct = { ...products[productIndex], ...updateFields };
        delete updatedProduct.id; // Proteger el ID original
        products[productIndex] = { ...products[productIndex], ...updatedProduct };

        await writeProductsFile(products);
        res.json({ message: "Producto actualizado con éxito", product: products[productIndex] });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Hubo un problema al actualizar el producto" });
    }
});

export default productsRouter;
