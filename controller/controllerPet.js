const { Pet } = require('../model/model');

exports.listar = async function (req, res) {
  try {
    res.set('Cache-Control', 'public, max-age=15552000, must-revalidate');
    const pets = await Pet.findAll();
    return res.json(pets);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar pets.' });
  }
};

exports.detalhes = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }
    return res.json(pet);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar detalhes do pet.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, especie } = req.body;
    if (!nome || !especie) {
      return res.status(400).json({ error: 'Nome e espécie são obrigatórios.' });
    }
    const novoPet = await Pet.create({ nome, especie });
    return res.status(201).json(novoPet);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pet.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { nome, especie } = req.body;
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }
    await pet.update({ nome, especie });
    return res.json(pet);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar pet.' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }
    await pet.destroy();
    return res.json({ message: 'Pet excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir pet.' });
  }
};