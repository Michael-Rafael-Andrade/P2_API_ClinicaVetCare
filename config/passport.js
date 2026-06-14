const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { Usuario } = require('../model/model.js');

// Chave secreta usada para assina e verificar os tokens JWT.
// Em produção, deve ser armazenada em variável de ambiente (ex: process.env.JWT_SECRET).
const JWT_SECRET = process.env.JWT_SECRET || 'CHAVE_SECRETA_DE_DESENVOLVIMENTO';

// Opções da estratégia JWT:
const opcoes = {
    // define como o token será extraído da requisição: do heade Autorization: Bearer <token>
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // chave para verificar a assinatura do token
    secretOrKey: JWT_SECRET,
};

// Configura a estratégia JWT do Passport
passport.use(
    new JwtStrategy(opcoes, async function (jwt_payload, done) {
        try {
            // Busca o usuário pelo id armazenado no payload do token
            const usuario = await Usuario.findByPk(jwt_payload.id);

            if (!usuario) {
                // Usuario não encontrado: token inválido ou usuário removido
                return done(null, false);
            }

            // Usuário encontrado: passa o objeto para req.user nas rotas protegidas
            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    })
);

// Exporta a instância do passport configurada e a constante JWT_SECRET
// JWT_SECRET é exportada para ser reutilizada no controller de login (geração do token)
module.exports = { passport, JWT_SECRET };