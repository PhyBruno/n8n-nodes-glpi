"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlpiApi = void 0;
class GlpiApi {
    constructor() {
        this.name = 'glpiApi';
        this.displayName = 'GLPI API';
        this.documentationUrl = 'https://your-glpi-docs-or-repo.example.com';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                placeholder: 'https://atendimento.centrium.com.br',
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
            },
            {
                displayName: 'User Token (optional)',
                name: 'userToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: false,
                description: 'Se presente, envia header "Authorization: user_token <token>" e pode ser usado para initSession.',
            },
            {
                displayName: 'Username (for Basic Auth, optional)',
                name: 'username',
                type: 'string',
                default: '',
                placeholder: 'usuário',
                required: false,
            },
            {
                displayName: 'Password (for Basic Auth, optional)',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                placeholder: 'senha',
                required: false,
            }
        ];
    }
}
exports.GlpiApi = GlpiApi;
//# sourceMappingURL=GlpiApi.credentials.js.map