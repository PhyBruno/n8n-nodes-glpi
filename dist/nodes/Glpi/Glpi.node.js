"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glpi = void 0;
const Glpi_descriptions_1 = require("./Glpi.descriptions");
class Glpi {
    constructor() {
        this.description = {
            displayName: 'GLPI',
            name: 'glpi',
            icon: 'file:glpi.svg',
            group: ['output'],
            version: 1,
            description: 'Interacts with GLPI API',
            defaults: {
                name: 'GLPI',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'glpiApi',
                    required: true,
                },
            ],
            properties: [
                ...Glpi_descriptions_1.glpiOperations,
                ...Glpi_descriptions_1.glpiFields,
            ],
        };
    }
    // Minimal helpers/HTTP omitted — only a safe stub so n8n will load the node.
    async buildBaseHeaders() {
        const credentials = await this.getCredentials?.('glpiApi');
        const headers = {
            'App-Token': credentials?.appToken || '',
            'Content-Type': 'application/json',
        };
        if (credentials?.userToken) {
            headers['Authorization'] = `user_token ${credentials.userToken}`;
        }
        return { baseUrl: credentials?.baseUrl || '', headers, auth: credentials?.username ? { user: credentials.username, pass: credentials.password } : undefined };
    }
    buildCriteriaQuery(criteriaInput) {
        if (!Array.isArray(criteriaInput) || criteriaInput.length === 0)
            return '';
        const parts = [];
        criteriaInput.forEach((c, i) => {
            parts.push(`criteria[${i}][glue]=${encodeURIComponent(String(c.glue || 'AND'))}`);
            parts.push(`criteria[${i}][field]=${encodeURIComponent(String(c.field || ''))}`);
            parts.push(`criteria[${i}][searchtype]=${encodeURIComponent(String(c.searchtype || 'contains'))}`);
            parts.push(`criteria[${i}][value]=${encodeURIComponent(String(c.value || ''))}`);
        });
        return parts.join('&');
    }
    async execute() {
        // Simple, safe implementation: return an empty array result for now.
        // Real implementations should perform HTTP calls using this.helpers.request(...)
        const returnData = [];
        return [returnData];
    }
}
exports.Glpi = Glpi;
//# sourceMappingURL=Glpi.node.js.map