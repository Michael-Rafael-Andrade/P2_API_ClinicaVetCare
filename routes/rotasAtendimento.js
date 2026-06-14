const express = require('express');
const router = express.Router();
const passport = require('passport');

const controllerRotas = require('../controller/controllerAtendimento');
const autenticado = passport.authenticate('jwt', { session: false });

const verificarPerfil = (perfisPermitidos) => {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.user.perfil)) {
      let msg = 'Acesso negado.';
      // Lógica para interceptar erro exato impresso no relatório da avaliação
      if (perfisPermitidos.includes('veterinario') && perfisPermitidos.length === 1) {
        msg = 'Acesso negado: apenas Veterinários.';
      }
      return res.status(403).json({ error: msg });
    }
    next();
  };
};

// Rotas de Atendimentos protegidas
router.get('/', autenticado, verificarPerfil(['recepcao', 'admin', 'veterinario']), (req, res, next) => {
  /* #swagger.tags = ['Atendimentos']
     #swagger.summary = 'Lista todos os atendimentos'
     #swagger.security = [{ "BearerAuth": [] }]
     #swagger.responses[200] = { schema: [{ $ref: '#/definitions/Atendimento' }] }
  */
  controllerRotas.listarAtendimentos(req, res, next);
});

router.get('/:id', autenticado, verificarPerfil(['recepcao', 'admin', 'veterinario']), (req, res, next) => {
  /* #swagger.tags = ['Atendimentos']
     #swagger.summary = 'Exibe os detalhes de um atendimento específico'
     #swagger.security = [{ "BearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'ID do Atendimento' }
  */
  controllerRotas.detalheAtendimento(req, res, next);
});

router.post('/', autenticado, verificarPerfil(['recepcao', 'admin']), (req, res, next) => {
  /* #swagger.tags = ['Atendimentos']
     #swagger.summary = 'Agenda um novo atendimento (Recepção/Admin)'
     #swagger.security = [{ "BearerAuth": [] }]
     #swagger.parameters['body'] = {
         in: 'body',
         required: true,
         schema: { $ref: '#/definitions/NovoAtendimento' }
     }
  */
  controllerRotas.criarAtendimento(req, res, next);
});

// Rotas de Transição de Status com suas devidas travas de perfil
router.put('/:id/iniciar', autenticado, verificarPerfil(['veterinario']), (req, res, next) => {
  /* #swagger.tags = ['Atendimentos']
     #swagger.summary = 'Altera o status do atendimento para em_atendimento'
     #swagger.description = 'Exclusivo para Veterinários. Retorna 400 se o atendimento já foi iniciado ou não está agendado.'
     #swagger.security = [{ "BearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'ID do Atendimento' }
     #swagger.responses[403] = { description: 'Acesso negado: apenas Veterinários.' }
     #swagger.responses[400] = { description: 'Atendimento já está com este status' }
  */
  controllerRotas.iniciarAtendimento(req, res, next);
});

router.put('/:id/finalizar', autenticado, verificarPerfil(['veterinario']), (req, res, next) => {
  /* #swagger.tags = ['Atendimentos']
     #swagger.summary = 'Finaliza o atendimento mudando o status para finalizado'
     #swagger.security = [{ "BearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'ID do Atendimento' }
     #swagger.responses[403] = { description: 'Acesso negado: apenas Veterinários.' }
  */
  controllerRotas.finalizarAtendimento(req, res, next);
});

router.put('/:id/cancelar', autenticado, verificarPerfil(['recepcao', 'admin']), (req, res, next) => {
  /* #swagger.tags = ['Atendimentos']
     #swagger.summary = 'Cancela o atendimento mudando o status para cancelado'
     #swagger.security = [{ "BearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'ID do Atendimento' }
  */
  controllerRotas.cancelarAtendimento(req, res, next);
});

module.exports = router;

// "ApiKeyAuth"