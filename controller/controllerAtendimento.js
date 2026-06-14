const { Atendimento, Pet, Usuario } = require('../model/model');

exports.listarAtendimentos = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const atendimentos = await Atendimento.findAll({
      include: [
        { model: Pet, as: 'pet' },
        { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'usuario', 'perfil'] }
      ]
    });
    return res.json(atendimentos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar atendimentos.' });
  }
};

exports.detalheAtendimento = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const atendimento = await Atendimento.findByPk(req.params.id, {
      include: [
        { model: Pet, as: 'pet' },
        { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'usuario', 'perfil'] }
      ]
    });
    if (!atendimento) {
      return res.status(404).json({ error: 'Atendimento não encontrado.' });
    }
    return res.json(atendimento);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter atendimento.' });
  }
};

exports.criarAtendimento = async (req, res) => {
  try {
    const { data_hora, motivo, pet_id } = req.body;
    if (!data_hora || !motivo || !pet_id) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
    }

    const pet = await Pet.findByPk(pet_id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet informado não encontrado.' });
    }

    const novoAtendimento = await Atendimento.create({
      data_hora,
      motivo,
      status: 'agendado',
      pet_id,
      usuario_id: req.user.id
    });

    return res.status(201).json(novoAtendimento);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar atendimento.' });
  }
};

exports.iniciarAtendimento = async function (req, res) {
  try {
    // Proteção de dados sensíveis contra cache
    res.set('Cache-Control', 'no-store');
    const atendimento = await Atendimento.findByPk(req.params.id);
    if (!atendimento) {
      return res.status(404).json({ error: 'Atendimento não encontrado.' });
    }

    // Regra da avaliação para status repetido
    if (atendimento.status === 'em_atendimento') {
      return res.status(400).json({ error: 'Atendimento ja está com este status' });
    }

    await atendimento.update({
      status: 'em_atendimento',
      usuario_id: req.user.id // Vincula o veterinário autenticado atual
    });

    return res.json(atendimento);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao iniciar atendimento.' });
  }
};

exports.finalizarAtendimento = async (req, res) => {
  try {
    // Proteção de dados sensíveis contra cache
    res.set('Cache-Control', 'private, max-age=86400, must-revalidate');
    const atendimento = await Atendimento.findByPk(req.params.id);
    if (!atendimento) {
      return res.status(404).json({ error: 'Atendimento não encontrado.' });
    }

    if (atendimento.status === 'finalizado') {
      return res.status(400).json({ error: 'Atendimento ja está com este status' });
    }

    await atendimento.update({
      status: 'finalizado',
      usuario_id: req.user.id
    });

    return res.json(atendimento);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao finalizar atendimento.' });
  }
};

exports.cancelarAtendimento = async (req, res) => {
  try {
    const atendimento = await Atendimento.findByPk(req.params.id);
    if (!atendimento) {
      return res.status(404).json({ error: 'Atendimento não encontrado.' });
    }

    await atendimento.update({
      status: 'cancelado'
    });

    return res.json(atendimento);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cancelar atendimento.' });
  }
};