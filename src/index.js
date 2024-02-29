const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const app = express();
const http = require("http").createServer(app);


//Initializations
require("./database");
require("./config/passport");


//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs"
}));
app.set("view engine", ".hbs");


//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(session({
    secret:"mysecretapp",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use(require("./routes/index"));
app.use(require("./routes/posts"));
app.use(require("./routes/users"));
app.post("/upload", (req, res) => {
    console.log("Imagen subida");
});


//Static Files
app.use(express.static(path.join(__dirname, "public")));


//Server is listening
http.listen(3000, () => {
    console.log("Listening on localhost:3000");
});