const helmet = require('helmet');

module.exports = function (isProd) {
    return helmet({
        // Content Security Policy (CSP)
        contentSecurityPolicy: isProd ? {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"], // Permite scripts do Swagger
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],  // Permite estilos do Swagger
                imgSrc: ["'self'", "data:"],
            },
        } : false, // Desativa CSP em desenvolvimento para não quebrar o Swagger localmente

        // Proteção contra Clickjacking (X-Frame-Options)
        // Impede que sua API seja renderizada dentro de um <frame> ou <iframe> de outro site
        frameguard: { action: 'deny' },

        // Remoção do cabeçalho X-Powered-By
        // Esconde que a aplicação utiliza Express/Node.js, dificultando a busca por vulnerabilidades específicas
        hidePoweredBy: true,

        // HSTS (Strict-Transport-Security)
        // Força o navegador a utilizar apenas conexões HTTPS seguras
        hsts: isProd ? {
            maxAge: 31536000, // 1 ano em segundos
            includeSubDomains: true,
            preload: true
        } : false, // Desativado em desenvolvimento (localhost usa HTTP puro)

        // Proteção contra Sniffing de tipo MIME (X-Content-Type-Options)
        // Força o navegador a seguir estritamente o Content-Type enviado pelo servidor (ex: application/json)
        noSniff: true,

        // Proteção contra Ataques de Filtro XSS (X-XSS-Protection)
        // Ativa o filtro de Cross-Site Scripting nos navegadores
        xssFilter: true
    });
};