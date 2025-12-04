"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlpiApi = void 0;
class GlpiApi {
    constructor() {
        this.name = 'glpiApi';
        this.displayName = 'GLPI API';
        this.documentationUrl = 'https://github.com/PhyBruno/n8n-nodes-glpi';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                placeholder: 'https://glpi.example.com',
                required: true,
                description: 'Base URL sem o sufixo /apirest.php',
            },
            {
                displayName: 'App Token',
                name: 'appToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Token da aplicação (App-Token)',
            },
            {
                displayName: 'User Token',
                name: 'userToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: false,
                description: 'Token do usuário (opcional). Se informado será enviado como Authorization: user_token <token>.',
            },
            {
                displayName: 'Username (Basic Auth)',
                name: 'username',
                type: 'string',
                default: '',
                required: false,
            },
            {
                displayName: 'Password (Basic Auth)',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: false,
            },
        ];
    }
}
exports.GlpiApi = GlpiApi;
//# sourceMappingURL=GlpiApi.credentials.js.map