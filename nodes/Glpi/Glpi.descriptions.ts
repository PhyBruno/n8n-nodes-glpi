import { INodeProperties } from 'n8n-workflow';

export const glpiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		options: [
			{ name: 'Init Session', value: 'initSession', description: 'GET /apirest.php/initSession' },
			{ name: 'Kill Session (force logout)', value: 'killSession', description: 'GET /apirest.php/killSession' },
			{ name: 'Search (generic) - Criteria Builder', value: 'search', description: 'GET /apirest.php/search/:entity' },
			{ name: 'Get Tickets (convenience)', value: 'getTickets', description: 'Search Ticket (with criteria builder or searchText)' },
			{ name: 'List Search Options', value: 'listSearchOptions', description: 'GET /apirest.php/listSearchOptions/:entity' },
			{ name: 'Get Item', value: 'getItem', description: 'GET /apirest.php/:itemtype/:id' },
			{ name: 'Get Ticket Followup', value: 'getTicketFollowup', description: 'GET /apirest.php/Ticket/:id/ITILFollowup' },
			{ name: 'Get Ticket Solution', value: 'getTicketSolution', description: 'GET /apirest.php/Ticket/:id/ITILSolution' },
			{ name: 'Get Ticket Tasks', value: 'getTicketTasks', description: 'GET /apirest.php/Ticket/:id/TicketTask' },
			{ name: 'Get User by ID', value: 'getUserById', description: 'GET /apirest.php/User/:id' },
			{ name: 'Get User by Email (helper)', value: 'getUserByEmail', description: 'Search User by email' },
			{ name: 'Create Ticket', value: 'createTicket', description: 'POST /apirest.php/Ticket' },
			{ name: 'Update Ticket', value: 'updateTicket', description: 'PUT /apirest.php/Ticket/:id' },
			{ name: 'Add Followup', value: 'addFollowup', description: 'POST /apirest.php/Ticket/:id/ITILFollowup' },
			{ name: 'Add Solution', value: 'addSolution', description: 'POST /apirest.php/ITILSolution' },
		],
		default: 'initSession',
	}
];

export const glpiFields: INodeProperties[] = [
	// entity for search and listSearchOptions
	{
		displayName: 'Entity',
		name: 'entity',
		type: 'string',
		default: 'Ticket',
		description: 'Entity name (Ticket, User, ITILCategory, ...).',
		displayOptions: { show: { operation: ['search', 'listSearchOptions', 'getTickets'] } },
	},
	// Criteria builder as fixedCollection multiple
	{
		displayName: 'Criteria',
		name: 'criteria',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Criterion',
		description: 'One or more criteria for the search',
		displayOptions: {
			show: {
				operation: ['search', 'getTickets'],
			},
		},
		options: [
			{
				displayName: 'Criterion',
				name: 'criterion',
				values: [
					{ displayName: 'Field', name: 'field', type: 'string', default: '' },
					{ displayName: 'Search Type', name: 'searchtype', type: 'options', options: [{ name: 'contains', value: 'contains' }], default: 'contains' },
					{ displayName: 'Value', name: 'value', type: 'string', default: '' },
					{ displayName: 'Glue (AND/OR)', name: 'glue', type: 'options', options: [{ name: 'AND', value: 'AND' }, { name: 'OR', value: 'OR' }], default: 'AND' },
				],
			},
		],
		default: [], // <-- obrigatório para fixedCollection com multipleValues: true
	},
	// range and searchText
	{
		displayName: 'Range',
		name: 'range',
		type: 'string',
		default: '0-50',
		displayOptions: { show: { operation: ['search', 'getTickets'] } },
		description: 'Range parameter for GLPI (ex: 0-500).'
	},
	{
		displayName: 'Search Text (convenience)',
		name: 'searchText',
		type: 'string',
		default: '',
		displayOptions: { show: { operation: ['getTickets'] } },
		description: 'searchText param for Ticket search.',
	},
	// generic itemId & ticketInput
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'number',
		default: 0,
		displayOptions: { show: { operation: ['getTicketFollowup','getTicketSolution','getTicketTasks','getItem','updateTicket','addFollowup'] } },
		description: 'ID of the item.',
	},
	{
		displayName: 'Ticket Input (JSON)',
		name: 'ticketInput',
		type: 'json',
		default: { input: {} },
		displayOptions: { show: { operation: ['createTicket','updateTicket'] } },
		description: 'Provide {"input": { ... }} body for Ticket creation or update.',
	},
	{
		displayName: 'Followup Input (JSON)',
		name: 'followupInput',
		type: 'json',
		default: { input: {} },
		displayOptions: { show: { operation: ['addFollowup'] } },
		description: 'Provide {"input": {...}} for ITILFollowup.',
	},
	{
		displayName: 'Solution Input (JSON)',
		name: 'solutionInput',
		type: 'json',
		default: { input: {} },
		displayOptions: { show: { operation: ['addSolution'] } },
		description: 'Provide {"input": {...}} for ITILSolution.',
	},
	// user helpers
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'number',
		default: 0,
		displayOptions: { show: { operation: ['getUserById'] } },
	},
	{
		displayName: 'User Email (helper)',
		name: 'userEmail',
		type: 'string',
		default: '',
		displayOptions: { show: { operation: ['getUserByEmail'] } },
	}
];
