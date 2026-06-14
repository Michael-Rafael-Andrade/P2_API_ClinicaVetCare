const swaggerAutogen = require('swagger-autogen')();

const doc = {
    // Informações básicas da API solicitadas para a VetCare
    info: {
        title: 'VetCare API',
        version: '1.0.0',
        description: 'API RESTful para gerenciamento de atendimentos veterinários com autenticação JWT (Avaliação Prática 02)',
    },

    // Servidor onde a API está disponível
    host: 'localhost:3000',

    // Protocolo usado
    schemes: ['http'],

    // Define o esquema de segurança BearerAuth (JWT via header Authorization)
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Informe o token JWT no formato: Bearer <seu_token>',
        },
    },

    // Schemas/Modelos de Dados oficiais da base vetcare_api
    definitions: {

        // Dados para cadastro de novo usuário (conforme modelo da prova)
        NovoUsuario: {
            $nome: 'Dr. Carlos Silva',
            $usuario: 'carlos_vet', 
            $senha: 'senha123',
            perfil: 'veterinario',  // "recepcao", "admin" ou "veterinario" (padrão: "recepcao")
        },

        // Retorno do usuário criado ou consultado (sem senha_hash)
        UsuarioResposta: {
            id: 1,
            nome: 'Dr. Carlos Silva',
            usuario: 'carlos_vet',
            perfil: 'veterinario'
        },

        // Dados para login
        LoginUsuario: {
            $usuario: 'carlos_vet',
            $senha: 'senha123',
        },

        // Retorno do login de sucesso
        LoginResposta: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            usuario: {
                id: 1,
                nome: 'Dr. Carlos Silva',
                usuario: 'carlos_vet',
                perfil: 'veterinario',
            },
        },

        // Dados para cadastrar um novo Pet
        NovoPet: {
            $nome: 'Thor',
            $especie: 'Cachorro'
        },

        // Modelo completo do Pet retornado
        PetResposta: {
            id: 1,
            nome: 'Thor',
            especie: 'Cachorro'
        },

        // Dados necessários para agendar/criar um Atendimento
        NovoAtendimento: {
            $data_hora: '2026-06-14T14:30:00.000Z',
            $motivo: 'Consulta de rotina e vacinação',
            $pet_id: 1
        },

        // Modelo completo de Atendimento usado nas listagens e respostas de sucesso
        AtendimentoResposta: {
            id: 1,
            data_hora: '2026-06-14T14:30:00.000Z',
            motivo: 'Consulta de rotina e vacinação',
            status: 'agendado', // "agendado", "em_atendimento", "finalizado"
            pet_id: 1,
            usuario_id: 4,
            criada_em: '2026-06-14T01:45:19.000Z',
            atualizada_em: '2026-06-14T01:45:19.000Z'
        },

        // Dados para atualização parcial de status (Ex: Iniciar ou Finalizar atendimento)
        AtualizarStatusAtendimento: {
            $status: 'em_atendimento' // Ou 'finalizado'
        }
    },
};

// Local onde o JSON gerado será salvo
const arquivo_saida = './config/swagger_output.json';

// Ponto de entrada das rotas (Geralmente o app.js na raiz que importa os roteadores)
const arquivo_rotas = ['./app.js'];

// Gera a documentação de forma automatizada
swaggerAutogen(arquivo_saida, arquivo_rotas, doc);