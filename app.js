import express from "express";
import connection, { dbConfig } from "./db.js";

//dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use("/resources", express.static("static"));
app.use("/resources", express.static(import.meta.url + "/public"));

app.set("view engine", "ejs");

app.get("/", (req, res) =>{
    res.render("index", {titulo: "Pagina de Inicio", nombre: "Josue Ortiz Ochoa"})
})

app.get("/login", (req, res) =>{
    res.render("login", {titulo: "Login", nombre: "Josue Ortiz Ochoa"})
})

app.get("/register", (req, res) =>{
    res.render("register", {titulo: "Login", nombre: "Josue Ortiz Ochoa"})
})

app.get("/contactame", (req, res) =>{
    res.render("contactame", {titulo: "Contactame"})
})

app.listen(PORT, () => {
    console.log("Pagina en: http://localhost:" + PORT);
  });