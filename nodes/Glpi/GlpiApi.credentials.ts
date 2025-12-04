import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class GlpiApi implements ICredentialType {
	name = 'glpiApi';
	displayName = 'GLPI API';
	documentationUrl = 'https://your-glpi-docs-or-repo.example.com';
	properties: INodeProperties[] = [
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
