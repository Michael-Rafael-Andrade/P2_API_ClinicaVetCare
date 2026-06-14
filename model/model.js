const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'vetcare_api',
    process.env.DB_USER || 'avaliacao_fullstack',
    process.env.DB_PASS || 'avaliacao_fullstack',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

// Modelo Usuario
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    perfil: {
        type: DataTypes.ENUM('recepcao', 'admin', 'veterinario'),
        allowNull: false,
        defaultValue: 'recepcao'
    }
},
    {
        // Configurações adicionais do modelo
        sequelize, // para estabelecer conexão com BD
        freezeTableName: true, // nome da tabela igual ao nome da classe
        createdAt: 'criada_em', // nome do atributo 'createdAt'
        updatedAt: 'atualizada_em', // nome do atributo 'updatedAt'
    },
);

// Modelo Pet
const Pet = sequelize.define('Pet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        // Configurações adicionais do modelo
        sequelize, // para estabelecer conexão com BD
        freezeTableName: true, // nome da tabela igual ao nome da classe
        createdAt: 'criada_em', // nome do atributo 'createdAt'
        updatedAt: 'atualizada_em', // nome do atributo 'updatedAt'
    },
);

// Modelo Atendimento
const Atendimento = sequelize.define('Atendimento', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('agendado', 'em_atendimento', 'finalizado', 'cancelado'),
        allowNull: false,
        defaultValue: 'agendado'
    }
},
    {
        // Configurações adicionais do modelo
        sequelize, // para estabelecer conexão com BD
        freezeTableName: true, // nome da tabela igual ao nome da classe
        createdAt: 'criada_em', // nome do atributo 'createdAt'
        updatedAt: 'atualizada_em', // nome do atributo 'updatedAt'
    },
);

// Associações / Relacionamentos
Pet.hasMany(Atendimento, { foreignKey: 'pet_id', as: 'atendimentos' });
Atendimento.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });

Usuario.hasMany(Atendimento, { foreignKey: 'usuario_id', as: 'atendimentos' });
Atendimento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });


// force : true => apaga toda tabela e constroi uma nova com base no modelo

// alter : true => altera a tabela ou sincroniza com a tabela

// Sincroniza os modelos com o banco de dados, aplicando alterações de estrutura (alter : true )
sequelize.sync({ alter: true }).then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
}).catch((error) => {
    console.log('Erro ao sincronizar modelos com o banco de dados: ', error);
});

module.exports = {
    sequelize,
    Usuario,
    Pet,
    Atendimento
};