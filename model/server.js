const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'vetcare_api',
    process.env.DB_USER || 'avaliacao_fullstack',
    process.env.DB_PASS || 'avaliacao_fullstack',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false, // Opcional: desativa logs SQL poluindo o terminal
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

// Testar o servidor
sequelize.authenticate().then(() => {
    console.log('Conexão com banco de dados estabelecida com sucesso.');
}).catch((error) => {
    console.error('Erro ao se conectar ao banco de dados: ', error);
});

module.exports = sequelize; // exportar