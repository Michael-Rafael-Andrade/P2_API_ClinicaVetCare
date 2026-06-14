const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'vetcare_api', // nome da base de dados
    'avaliacao_fullstack', // nome do usuário do banco de dados
    'avaliacao_fullstack', // senha do usuáio
    {
        host: 'localhost', // endereço do Banco de Dados
        dialect: 'mysql'  // dialeto do Banco de Dados
    }
);

// Testar o servidor
sequelize.authenticate().then(() => {
    console.log('Conexão com banco de dados estabelecida com sucesso.');
}).catch((error) => {
    console.error('Erro ao se conectar ao banco de dados: ', error);
});

module.exports = sequelize; // exportar