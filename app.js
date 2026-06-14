// importação do dotenv para carregar variáveis de ambiente do arquivo .env 
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // importar o session do express


// Importar o arquivo de configuração do helmet (que retorna uma função)
var helmetMiddleware = require('./config/helmet'); // importar o arquivo de configuração do helmet


// importação do swagger-ui-express e do JSON gerado pelo swagger-autogen
var swagger = require('swagger-ui-express');
// importação do JSON gerado pelo swagger-autogen
var swagger_saida = require('./config/swagger_output.json');

// Importa o passport já configurado com a estratégia JWT
var { passport, JWT_SECRET } = require('./config/passport');

// Importação das rotas com os nomes corrigidos
var rotasIndex = require('./routes/rotasIndex');
var rotasPet = require('./routes/rotasPet');
var rotasAtendimento = require('./routes/rotasAtendimento');
var rotasUsuarios = require('./routes/rotasUsuarios');

var app = express();


// Executa a função do middleware do Helmet passando a checagem de ambiente
app.use(helmetMiddleware(process.env.ENV === 'prod'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração e ativação da rota visual da documentação do Swagger UI
app.use('/api-docs', swagger.serve, swagger.setup(swagger_saida));

// Inicializa o passport no Express para habilitar a autenticação de rotas
app.use(passport.initialize());

// Vinculação correta dos middlewares de rotas utilizando as variáveis criadas
app.use('/', rotasIndex);
app.use('/pet', rotasPet);
app.use('/usuario', rotasUsuarios);
app.use('/atendimento', rotasAtendimento);

module.exports = app;
