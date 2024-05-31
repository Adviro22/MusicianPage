import express from "express";
import { auth } from "./auth.js";
import connection, { dbConfig } from "./db.js";
import cookieSession from "cookie-session";
import bcryptjs from "bcryptjs";

//dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use("/resources", express.static("static"));
app.use("/resources", express.static(import.meta.url + "/public"));

app.set("view engine", "ejs");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"], // Claves de cifrado, cámbialas por valores secretos
    maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la cookie en milisegundos (1 día)
  })
);

app.get("/", (req, res) => {
  res.render("index", {
    titulo: "Pagina de Inicio",
    nombre: "Josue Ortiz Ochoa",
  });
});

app.get("/login", (req, res) => {
  res.render("login", { titulo: "Login", nombre: "Josue Ortiz Ochoa" });
});

app.get("/register", (req, res) => {
  res.render("register", { titulo: "Register", nombre: "Josue Ortiz Ochoa" });
});

app.get("/contactame", (req, res) => {
  res.render("contactame", { titulo: "Contactame" });
});

//BLOG

app.get("/blog", (req, res) => {
  res.render("blog", { titulo: "Blog" });
});

//POSTS

app.get("/blog/post/1", (req, res) => {
  res.render("post1", { titulo: "Posts" });
});

app.get("/blog/post/2", (req, res) => {
  res.render("post2", { titulo: "Posts" });
});

app.get("/blog/post/3", (req, res) => {
  res.render("post3", { titulo: "Posts" });
});

//

app.get("/menu-subida-archivo", auth, (req, res) => {
  // Obtener información del usuario de la sesión
  const user = req.session.user;

  // Verificar si el usuario está logueado
  if (user) {
    res.render("menu_subida_archivo", {
      titulo: "Menú",
      user: user.user, // Pasar el nombre del usuario al renderizado de la plantilla
    });
  } else {
    // Si el usuario no está logueado, redirigir al login
    res.redirect("/login");
  }
});

//Register
app.post("/register", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const password = req.body.password;
  let passwordHaash = await bcryptjs.hash(password, 8);
  connection.query(
    "INSERT INTO User SET ?",
    { user: user, name: name, password: passwordHaash },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send("REGISTRO EXITOSO");
      }
    }
  );
});

// Dentro de tu ruta de autenticación ("/auth")
app.post("/auth", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  let passwordHash = await bcryptjs.hash(password, 8);
  if (user && password) {
    connection.query(
      "SELECT * FROM User WHERE user = ?",
      [user],
      async (error, results) => {
        if (
          results.length == 0 ||
          !(await bcryptjs.compare(password, results[0].password))
        ) {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "USUARIO y/o PASSWORD incorrectas",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "login",
          });
        } else {
          // Crear un objeto de usuario
          const userInfo = {
            id: results[0].id,
            user: results[0].user,
            name: results[0].name,
          };

          // Almacena el objeto de usuario en la sesión de la cookie
          req.session.user = userInfo;

          // Establece una cookie para indicar que el usuario está autenticado
          req.session.loggedin = true;

          // Redirige al usuario a la página principal después del inicio de sesión
          res.redirect("/menu-subida-archivo");
        }
      }
    );
  } else {
    res.send("Por favor ingrese un usuario y contraseña");
  }
});

// La ruta de cierre de sesión
app.get("/logout", function (req, res) {
  req.session = null; // Destruye la sesión eliminándola
  res.redirect("/"); // Redirige al inicio u otra página después de cerrar sesión
});

app.listen(PORT, () => {
  console.log("Pagina en: http://localhost:" + PORT);
});
