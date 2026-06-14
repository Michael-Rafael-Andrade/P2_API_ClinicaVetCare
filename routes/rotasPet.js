const express = require('express');
const router = express.Router();
const passport = require('passport');

const controllerPet = require('../controller/controllerPet');
const autenticado = passport.authenticate('jwt', { session: false });

const verificarPerfil = (perfisPermitidos) => {
    return (req, res, next) => {
        if (!perfisPermitidos.includes(req.user.perfil)) {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        next();
    };
};
router.get('/', autenticado, verificarPerfil(['recepcao', 'admin', 'veterinario']), (req, res, next) => {
    /* #swagger.tags = ['Pets']
       #swagger.summary = 'Lista todos os pets cadastrados'
       #swagger.description = 'Disponível para qualquer perfil autenticado. Resposta armazenada em cache por 30 segundos.'
       #swagger.security = [{ "BearerAuth": [] }]
       #swagger.responses[200] = {
           description: 'Lista obtida com sucesso.',
           schema: [{ $ref: '#/definitions/Pet' }]
       }
       #swagger.responses[401] = { description: 'Não autenticado: Token inválido ou ausente.' }
    */
    controllerPet.listar(req, res, next);
});

router.get('/:id', autenticado, verificarPerfil(['recepcao', 'admin', 'veterinario']), (req, res, next) => {
    /* #swagger.tags = ['Pets']
       #swagger.summary = 'Exibe detalhes de um pet específico'
       #swagger.security = [{ "BearerAuth": [] }]
       #swagger.parameters['id'] = { description: 'ID do Pet' }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/Pet' } }
       #swagger.responses[401] = { description: 'Não autenticado.' }
    */
    controllerPet.detalhes(req, res, next);
});

router.post('/', autenticado, verificarPerfil(['recepcao', 'admin']), (req, res, next) => {
    /* #swagger.tags = ['Pets']
       #swagger.summary = 'Cadastra um novo pet no sistema'
       #swagger.security = [{ "BearerAuth": [] }]
       #swagger.parameters['body'] = {
           in: 'body',
           description: 'Dados do pet',
           required: true,
           schema: { $ref: '#/definitions/NovoPet' }
       }
       #swagger.responses[401] = { description: 'Não autenticado.' }
       #swagger.responses[403] = { description: 'Acesso negado.' }
    */
    controllerPet.criar(req, res, next);
});

router.put('/:id', autenticado, verificarPerfil(['recepcao', 'admin']), (req, res, next) => {
    /* #swagger.tags = ['Pets']
       #swagger.summary = 'Atualiza os dados de um pet existente'
       #swagger.security = [{ "BearerAuth": [] }]
       #swagger.parameters['id'] = { description: 'ID do Pet' }
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: { $ref: '#/definitions/NovoPet' }
       }
       #swagger.responses[401] = { description: 'Não autenticado.' }
       #swagger.responses[403] = { description: 'Acesso negado.' }
    */
    controllerPet.atualizar(req, res, next);
});

router.delete('/:id', autenticado, verificarPerfil(['admin']), (req, res, next) => {
    /* #swagger.tags = ['Pets']
       #swagger.summary = 'Exclui um pet do sistema (Apenas administradores)'
       #swagger.security = [{ "BearerAuth": [] }]
       #swagger.parameters['id'] = { description: 'ID do Pet' }
       #swagger.responses[401] = { description: 'Não autenticado.' }
       #swagger.responses[403] = { description: 'Acesso negado.' }
    */
    controllerPet.deletar(req, res, next);
});

module.exports = router;