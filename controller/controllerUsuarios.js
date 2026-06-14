const { Usuario } = require('../model/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastro = async (req, res) => {
  try {
    const { nome, usuario, senha, perfil } = req.body;
    if (!usuario || !senha || !nome) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    const novoUsuario = await Usuario.create({
      nome,
      usuario,
      senha_hash,
      perfil: perfil || 'recepcao'
    });

    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      usuario: novoUsuario.usuario,
      perfil: novoUsuario.perfil
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'O nome de usuário informado já existe.' });
    }
    return res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais incorretas.' });
    }

    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciais incorretas.' });
    }

    const payload = { id: user.id, nome: user.nome, perfil: user.perfil };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secret_key_vetcare_2026', {
      expiresIn: '8h'
    });

    return res.json({
      auth: true,
      token: `Bearer ${token}`,
      user: { id: user.id, nome: user.nome, perfil: user.perfil }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor ao efetuar login.' });
  }
};