const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.use(bodyParser.urlencoded({extends: false}))
app.use(bodyParser.json())

app.post("/cadastrar", function(req, res){
    // res.send("Nome" + req.body.nome)
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.send("Dados cadastrados com sucesso!")
    }).catch(function(erro){
        res.send("Falha ao cadastrar: " + erro)
    })
})

app.get("/consulta", function(req, res){
    post.findAll().then(function(post){
        res.render("consulta", {post})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})

app.get("/editar/:id", function(req, res){
    post.findAll({where: {'id': req.params.id}})
        .then(function(post){
            res.render("editar", {post});
        })
        .catch(function(erro){
            console.error("Erro ao carregar dados do banco: " + erro);
            res.status(500).send("Erro ao carregar dados do banco: " + erro);
        });
});

app.get("/excluir/:id", function(req, res){
    post.destroy({where: {'id': req.params.id}}).then(function(){
        res.render("primeira_pagina")
    }).catch(function(erro){
        console.log("Erro ao excluir ou encontrar os dados do banco: " + erro)
    })
})

app.post("/atualizar", function(req, res){
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    },{
        where: {
            id: req.body.id
        }
    }).then(function(){
        res.redirect("/consulta")
    })
})


app.listen(8081, function(){
    console.log("Servidor Ativo!")
})