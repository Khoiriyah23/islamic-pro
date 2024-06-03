const Admin = require("../models/admin.model")
const Book = require("../models/book.model")
const bcrypt = require("bcryptjs")

const signupPage = (req, res) => {
    res.render("admin_signup", {error: req.flash("error"), form: req.flash("formData")});
}

const addAdmin = (req, res) => {
    Admin.findOne({email: req.body.email})
    .then((admin) => {
        if(admin) {
             req.flash("error", "Admin with the same email address already exist")
             req.flash("formData", req.body)
             return res.redirect("/admin/signup")
     }
            const hashPassword = bcrypt.hashSync(req.body.password,  10);
            const adminData = {
                firstName: req.body.fName,
                lastName:  req.body.lName,
                email : req.body.email,
                password :hashPassword

            }

            Admin.create(adminData)
            .then((admin)=> {
               return res.redirect("/admin/login")
            })
            .catch((err) => {
                req.flash("error", err._message)
                req.flash("formData", req.body)
                res.redirect("/admin/signup")
            })   
    })
    .catch((error) => {
        req.flash("error", error._message)
        req.flash("formData", req.body)
        return res.redirect("/admin/signup")
        
    })
}


const loginPage = (req, res) => {
    res.render("admin_login", {error: req.flash("error"), form: req.flash("formData")});
}

const login = (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        req.flash("error", "Email, Name, and Password are required");
        req.flash("formData", req.body);
        return res.redirect("/admin/login")
    }

    Admin.findOne({email})
    .then((admin) => {
        if(!admin) {
            req.flash("error", "Admin account with the given email doesn't exist");
            req.flash("formData", req.body);
            return res.redirect("/admin/login")
        } else if(!bcrypt.compareSync(password, admin.password)) {
            req.flash("error", "Incorrect Password");
            req.flash("formData", req.body);
            return res.redirect("/admin/login")
        }
        req.session.adminId = admin._id;
        return res.redirect("/admin/profile")

    })
    .catch((error) => {
        req.flash("error", error._message);
        req.flash("formData", req.body);
        return res.redirect("/admin/login")
    })
}

const profilePage = (req, res) => {
    Admin.findOne({_id: req.session.adminId})
    .then((admin) => {
        Book.find({admin: req.session.adminId})
        .then((books) => {
            res.render("admin_profile", {profile: admin, books});

        })
        .catch((error) => {
            req.flash("error", error._message);
            return res.redirect("/admin/login")
        })
    })
    .catch((error) => {
        req.flash("error", error._message);
        return res.redirect("/admin/login")
    })
}

const logOut = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    })
}

module.exports = {
    signupPage,
    loginPage,
    addAdmin,
    login,
    profilePage,
    logOut
}