

const adminAuth =  (req, res, next) => {
    if(!req.session || !req.session.adminId) {
        req.flash("error", "Access Denied: You need to be loged in to view this page");
        return res.redirect("/admin/login")
    }

    next();
}

module.exports = adminAuth;