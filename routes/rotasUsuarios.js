var express = require('express');
var router = express.Router();
const controllerUsuarios = require('../controller/controllerUsuarios');

router.post('/usuarios', (req, res, next) => {
    /* #swagger.tags = ['Usuários']
       #swagger.summary = 'Cadastra um novo usuário no sistema (VetCare)'
       #swagger.parameters['body'] = {
           in: 'body',
           description: 'Dados para criação do usuário',
           required: true,
           schema: { $ref: '#/definitions/NovoUsuario' }
       } 
    */
    controllerUsuarios.cadastro(req, res, next); 
});

router.post('/cadastro', (req, res, next) => {
    /* #swagger.tags = ['Usuários']
       #swagger.summary = 'Mapeamento alternativo para cadastro de usuário'
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: { $ref: '#/definitions/NovoUsuario' }
       }
    */
    controllerUsuarios.cadastro(req, res, next);
});

router.post('/login', (req, res, next) => {
    /* #swagger.tags = ['Usuários']
       #swagger.summary = 'Autentica um usuário e retorna o Token JWT'
       #swagger.parameters['body'] = {
           in: 'body',
           description: 'Credenciais de acesso',
           required: true,
           schema: { $ref: '#/definitions/LoginUsuario' }
       } 
    */
    controllerUsuarios.login(req, res, next);
});

module.exports = router;