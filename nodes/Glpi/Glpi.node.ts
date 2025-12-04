import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import { glpiOperations, glpiFields } from './Glpi.descriptions';

export class Glpi implements INodeType {
    description: INodeTypeDescription = {
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
            ...glpiOperations,
            ...glpiFields,
        ],
    };

    // Minimal helpers/HTTP omitted — only a safe stub so n8n will load the node.
    private async buildBaseHeaders(this: any) {
        const credentials = await this.getCredentials?.('glpiApi');
        const headers: Record<string, string> = {
            'App-Token': credentials?.appToken || '',
            'Content-Type': 'application/json',
        };
        if (credentials?.userToken) {
            headers['Authorization'] = `user_token ${credentials.userToken}`;
        }
        return { baseUrl: credentials?.baseUrl || '', headers, auth: credentials?.username ? { user: credentials.username, pass: credentials.password } : undefined };
    }

    private buildCriteriaQuery(criteriaInput: Array<any>): string {
        if (!Array.isArray(criteriaInput) || criteriaInput.length === 0) return '';
        const parts: string[] = [];
        criteriaInput.forEach((c: any, i: number) => {
            parts.push(`criteria[${i}][glue]=${encodeURIComponent(String(c.glue || 'AND'))}`);
            parts.push(`criteria[${i}][field]=${encodeURIComponent(String(c.field || ''))}`);
            parts.push(`criteria[${i}][searchtype]=${encodeURIComponent(String(c.searchtype || 'contains'))}`);
            parts.push(`criteria[${i}][value]=${encodeURIComponent(String(c.value || ''))}`);
        });
        return parts.join('&');
    }

    async execute(this: any): Promise<INodeExecutionData[][]> {
        // Simple, safe implementation: return an empty array result for now.
        // Real implementations should perform HTTP calls using this.helpers.request(...)
        const returnData: INodeExecutionData[] = [];
        return [returnData];
    }
}
