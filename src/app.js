const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Book = require("./models/book.model");
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const adminAuth = require("./middleware/admin.middleware")


mongoose.connect("mongodb://127.0.0.1:27017/islamic_pro")
.then(() => {
    console.log("Database is connected successfully!");
})
.catch((err) => {
    console.log("Error connecting to DB:", err.message);
})

app.use(session({
    secret: "Islamic101",
    resave: true,
    saveUninitialized: false

}))
app.use(flash())
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload());
app.use((req, res, next) => {
    res.locals.adminSession = req.session.adminId;
    next();
})

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const {homePage, booksPage, createBookPage, bookDetailsPage, editBookPage, createResource, updateResource, deleteResource, downloadFile} =
 require("./controllers/book.controller");

const { signupPage, addAdmin, loginPage, login, profilePage, logOut } = require("./controllers/admin.controller")

app.get("/", homePage)
app.get("/books", booksPage )
app.get("/books/new",adminAuth, createBookPage)
app.get("/books/:bookId", bookDetailsPage )
app.get("/books/:bookId/edit", editBookPage)
app.post("/books", adminAuth, createResource)
app.get("/uploads/:filename", fileUpload)
app.get("/download/:filename", downloadFile)


app.put("/books/:id",adminAuth, updateResource)
app.delete("/books/:id", adminAuth, deleteResource)


app.get("/admin/signup", signupPage)
app.post("/admin/signup", addAdmin)
app.get("/admin/login", loginPage)
app.post("/admin/login", login )
app.get("/admin/profile",adminAuth, profilePage);

app.post("/admin/logout", logOut)


app.listen(3000, () => {
    console.log("App is running steadily");
});