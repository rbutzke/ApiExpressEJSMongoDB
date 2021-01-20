const { response, request } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET home page. */
router.get("/", function (req, res, next) {
  db.findCustomers()
    .then((customers) => {
      console.log(customers);
      res.render("index", { title: "Express", customers });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", {
        message: "Não foi possível listar os clientes",
        error,
      });
    });
});

router.get("/new", (req, res) => {
  res.render("customer", { title: "Cadastro de Cliente", customer: {} });
});

router.get("/edit/:customerId", (req, res) => {
  const id = req.params.customerId;
  db.findCustomer(id)
    .then((customer) =>
      res.render("customer", { title: "Edição de Cadastro", customer })
    )
    .catch((error) => console.log(error));
});

router.get("/delete/:customerId", (req, res) => {
  const id = req.params.customerId;
  db.deleteCustomer(id)
    .then((result) => res.redirect("/"))
    .catch((error) => console.log(error));
});

router.post("/new", (req, res) => {
  if (!req.body.nome) {
    return res.redirect("/?error=0 campo nome é obrigatório");
  }

  if (req.body.idade && !/[0-9]+/.test(req.body.idade)) {
    return res.redirect("/new?error=0 campo idade é numérico !!!");
  }

  const id = req.body.id;
  const nome = req.body.nome;
  const idade = parseInt(req.body.idade);
  const cidade = req.body.cidade;
  const uf = req.body.uf.length > 2 ? "" : req.body.uf;

  const customer = { nome, idade, cidade, uf };
  const promise = id
    ? db.updateCustomer(id, customer)
    : db.insertCustomer(customer);

  promise
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => {
      return console.log(error);
    });
});

module.exports = router;
