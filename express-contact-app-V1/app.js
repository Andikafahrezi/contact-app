const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
} = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

// use view ejs
app.set("view engine", "ejs");

//third party middleware
app.use(expressLayouts);

//build-in static middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// flash config
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

//application level middleware
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "diks",
      email: "diks@gmail.com",
    },
    {
      nama: "march",
      email: "march049@gmail.com",
    },
    {
      nama: "kleps",
      email: "kleps097@gmail.com",
    },
  ];

  //route
  res.render("index", {
    nama: "diks",
    mahasiswa: mahasiswa,
    title: "main",
    layout: "layouts/main",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main",
    title: "About",
  });
});
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    layout: "layouts/main",
    title: "Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

//process-add-data
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("contact already registered!");
      }
      return true;
    }),

    check("email", "email not valid!").isEmail(),
    check("nohp", "nomer handphone not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "form add contact",
        layout: "layouts/main",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      //send flash message
      req.flash("msg", "successfully added contact!");
      res.redirect("/contact");
    }
  }
);

//form add contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
  title: "form add data",
    layout: "layouts/main",
  });
});

//proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  //if contact not found
  if (!contact) {
    req.status(404);
    req.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Contact succesfully deleted!");
    res.redirect("/contact");
  }
});

//form update contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama)
  res.render("edit-contact", {
    title: "form update data",
    layout: "layouts/main",
    contact,
  });
});

//proccess update data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, {req}) => {
      const duplikat = cekDuplikat(value);
      if ( value !== req.body.oldnama && duplikat) {
        throw new Error("contact already regostered!");
      }
      return true;
    }),

    check("email", "email not valid!").isEmail(),
    check("nohp", "nomer handphone not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "form update contact",
        layout: "layouts/main",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      //send flash message
      req.flash("msg", "contact successfully updated!");
      res.redirect("/contact");
    }
  }
);
// page detail contact
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    layout: "layouts/main",
    title: "halaman Detail Contact",
    contact,
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
