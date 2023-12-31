import { Router } from "express";
import { ProductManager } from "../dao/FileSystem/ProductManager.js";
import ProductDao from "../dao/mongodb/ProductDao.js";
import UserDao from "../dao/mongodb/userDao.js";
import { socketServer } from "../server.js";

const router = Router();
const productManager = new ProductManager("../src/data/products.json");
const productDao = new ProductDao();
const userDao = new UserDao();

router.get("/index", async (req, res) => {
  try {
    const products = await productDao.getAll();
    res.render("home", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productDao.getAll();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/realtimeproducts", async (req, res) => {
  try {
    const product = req.body;
    await productDao.create(product);
    socketServer.emit("newProduct", product);
    const products = await productDao.getAll();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

export default router;