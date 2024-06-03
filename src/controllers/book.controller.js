
const Book = require("../models/book.model")
const path = require('path');
const { model } = require('mongoose');





const homePage = (req, res) => {
    res.render("index.ejs");
}
const booksPage = (req,res) => {
        Book.find()
        .then((books) => {
            res.render('job-listings.ejs',{books});
        })
        .catch((error) => {
            res.redirect("/");
        })
        
    }

const createBookPage = (req,res) => {
    res.render("create_resource", {error: req.flash("errorMsg"), form: req.flash("form")});
}

const bookDetailsPage = (req, res) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
    .then((book) => {
            res.render("single_resource", { book, path: path });
    })
    .catch(error => {
        console.log(error);
        res.redirect("/")
    })
}

const editBookPage = (req, res) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
    .then((book) => {
        res.render("edit_resource", {book, error: req.flash("error")});
    })
    .catch(error => {
        res.redirect("/")
    })
}

const createResource = async (req, res) => {
    let formData = {};

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    const { nanoid } = await import('nanoid');

    const sampleFile = req.files.file;
    const fileExtension = path.extname(sampleFile.name);
    const newFileName = Date.now() + fileExtension;

    const uploadPath = __dirname + '/../public/uploads/' + newFileName;

    sampleFile.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        formData.file = newFileName;

        console.log('File extension:', fileExtension);
        console.log('Uploaded file name:', sampleFile.name);
        console.log('Upload path:', uploadPath);

        const data = {
            srcName: req.body.srcName,
            subjects: req.body.subjects,
            title: req.body.title,
            datePublished: req.body.datePublished, 
            description: req.body.description,
            numberOfPages: req.body.numberOfPages,
            dateUpdated: req.body.dateUpdated,
            imageUrl: req.body.imageUrl,
            file: formData.file,
            admin: req.session.adminId
        };
        console.log(data);

        Book.create(data)
            .then((book) => {
                res.redirect("/books/" + book._id);
            })
            .catch((error) => {
                console.log(error);
                req.flash("errorMsg", error._message);
                req.flash("form", req.body);
                return res.status(500).send("Internal Server Error");
            });
    });
};



const fileUpload = (req, res) => {
    const filename = req.params.filename;
    res.sendFile(__dirname + "/public/uploads/" + filename);
}

const updateResource = async (req, res) => {
    let formData = {};

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    const { nanoid } = await import('nanoid');

    const sampleFile = req.files.file;
    const fileExtension = path.extname(sampleFile.name);
    const newFileName = Date.now() + fileExtension;

    const uploadPath = __dirname + '/../public/uploads/' + newFileName;

    sampleFile.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        formData.file = newFileName;

        console.log('File extension:', fileExtension);
        console.log('Uploaded file name:', sampleFile.name);
        console.log('Upload path:', uploadPath);

        const data = {
            srcName: req.body.srcName,
            subjects: req.body.subjects,
            title: req.body.title,
            datePublished: req.body.datePublished, 
            description: req.body.description,
            numberOfPages: req.body.numberOfPages,
            dateUpdated: req.body.dateUpdated,
            imageUrl: req.body.imageUrl,
            file: formData.file,
            admin: req.session.adminId
        };
        console.log(data);

        Book.create(data)
            .then((book) => {
                res.redirect("/books/" + book._id);
            })
            .catch((error) => {
                console.log(error);
                req.flash("errorMsg", error._message);
                req.flash("form", req.body);
                return res.status(500).send("Internal Server Error");
            });
    });
};

const deleteResource = (req, res)  => {
    const bookId = req.params.id;
    Book.findByIdAndDelete(bookId)
    .then(() => {
        res.redirect("/books")
    })
    .catch((error) => {
        req.flash("error", error._message)
        res.redirect("/books")
    })
}
const downloadFile = (req, res) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
        .then((book) => {
            if (!book || !book.file) {
                return res.status(404).send('File not found');
            }
            const filePath = __dirname + '/public/uploads/' + book.file; 

            fs.access(filePath, (err) => {
                if (err) {
                    console.error('File not found:', err);
                    return res.status(404).send('File not found');
                }
                res.setHeader('Content-Disposition', `attachment; filename="${book.file}"`);
                res.sendFile(filePath, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).send('Internal Server Error');
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Database error:', error);
            res.status(500).send('Internal Server Error');
        });
};


module.exports = {
    homePage,
    booksPage,
    createBookPage,
    bookDetailsPage,
    editBookPage,
    createResource,
    fileUpload,
    updateResource,
    deleteResource,
    downloadFile
}