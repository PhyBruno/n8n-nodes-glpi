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
            group: ['transform'],
            version: 1,
            description: 'GLPI REST API node (GLPI 10.x) with Criteria Builder and automatic session (no cache).',
            defaults: { name: 'GLPI' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'glpiApi', required: true }],
            properties: [
                ...Glpi_descriptions_1.glpiOperations,
                ...Glpi_descriptions_1.glpiFields,
            ],
        };
    }
    // build base headers & possible basic auth from credentials
    async buildBaseAuth() {
        const credentials = await this.getCredentials('glpiApi');
        if (!credentials)
            throw new Error('Credenciais GLPI não configuradas.');
        const baseUrl = credentials.baseUrl.replace(/\/+$/, '');
        const appToken = credentials.appToken;
        const userToken = credentials.userToken;
        const username = credentials.username;
        const password = credentials.password;
        const headers = {
            'App-Token': appToken,
            'Content-Type': 'application/json',
        };
        let auth;
        if (userToken && userToken.toString().trim() !== '') {
            headers['Authorization'] = `user_token ${userToken}`;
        }
        else if (username && username.toString().trim() !== '') {
            auth = { user: username, pass: password };
        }
        return { baseUrl, headers, auth };
    }
    // request initSession and return session token
    async getSessionToken(baseUrl, headers, auth) {
        // initSession is GET
        const endpoint = `${baseUrl}/apirest.php/initSession`;
        const response = await this.helpers.request({
            method: 'GET',
            uri: endpoint,
            headers,
            auth,
            json: true,
            resolveWithFullResponse: false,
        });
        // response usually contains session_token
        // support different shapes: { session_token: '...' } or { session: { session_token: '...' } }
        if (!response) {
            throw new Error('No response from GLPI initSession');
        }
        const token = response.session_token || response.session?.session_token;
        if (!token) {
            throw new Error('No session token returned by GLPI initSession');
        }
        return token;
    }
    // monta query string para criteria[] usando índice sequencial
    buildCriteriaQuery(criteriaInput) {
        if (!criteriaInput || !Array.isArray(criteriaInput) || criteriaInput.length === 0)
            return '';
        const parts = [];
        // Because fixedCollection returns array of {criterion: [ ... ]}, flatten
        let flat = [];
        for (const c of criteriaInput) {
            if (c && c.criterion && Array.isArray(c.criterion))
                flat = flat.concat(c.criterion);
            else if (Array.isArray(c))
                flat = flat.concat(c);
            else
                flat.push(c);
        }
        for (let i = 0; i < flat.length; i++) {
            const item = flat[i];
            parts.push(`criteria[${i}][field]=${encodeURIComponent(String(item.field))}`);
            parts.push(`criteria[${i}][searchtype]=${encodeURIComponent(String(item.searchtype))}`);
            parts.push(`criteria[${i}][value]=${encodeURIComponent(String(item.value))}`);
            // send glue (logical operator) — use "glue" key (change to "email" only if required for compatibility)
            parts.push(`criteria[${i}][glue]=${encodeURIComponent(String(item.glue || 'AND'))}`);
        }
        return parts.join('&');
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        // build base auth & headers
        const { baseUrl, headers: baseHeaders, auth } = await this.buildBaseAuth();
        try {
            // If operation is initSession itself, just call it and return
            if (operation === 'initSession') {
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/initSession`, headers: baseHeaders, auth, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // For all other operations, per your option C (no cache) -> request NEW session token now
            const sessionToken = await this.getSessionToken(baseUrl, baseHeaders, auth);
            // add Session-Token header for subsequent requests
            const headers = { ...baseHeaders, 'Session-Token': sessionToken };
            // handle operations
            // killSession (force logout)
            if (operation === 'killSession') {
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/killSession`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // listSearchOptions
            if (operation === 'listSearchOptions') {
                const entity = this.getNodeParameter('entity', 0);
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/listSearchOptions/${entity}`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // generic search (build criteria)
            if (operation === 'search') {
                const entity = this.getNodeParameter('entity', 0);
                const criteriaInput = this.getNodeParameter('criteria', 0, []);
                const range = this.getNodeParameter('range', 0, '0-50');
                const qs = this.buildCriteriaQuery(criteriaInput);
                const endpoint = `${baseUrl}/apirest.php/search/${entity}?${qs}&range=${encodeURIComponent(range)}`;
                const response = await this.helpers.request({ method: 'GET', uri: endpoint, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // getTickets convenience
            if (operation === 'getTickets') {
                const criteriaInput = this.getNodeParameter('criteria', 0, []);
                const range = this.getNodeParameter('range', 0, '0-50');
                const searchText = this.getNodeParameter('searchText', 0, '');
                const qs = this.buildCriteriaQuery(criteriaInput);
                let endpoint = `${baseUrl}/apirest.php/search/Ticket?${qs}&range=${encodeURIComponent(range)}`;
                if (searchText && searchText.trim() !== '')
                    endpoint += `&searchText=${encodeURIComponent(searchText)}`;
                const response = await this.helpers.request({ method: 'GET', uri: endpoint, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // getItem generic
            if (operation === 'getItem') {
                const entity = this.getNodeParameter('entity', 0);
                const itemId = this.getNodeParameter('itemId', 0);
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/${entity}/${itemId}`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // getTicketFollowup
            if (operation === 'getTicketFollowup') {
                const itemId = this.getNodeParameter('itemId', 0);
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/Ticket/${itemId}/ITILFollowup`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // getTicketSolution
            if (operation === 'getTicketSolution') {
                const itemId = this.getNodeParameter('itemId', 0);
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/Ticket/${itemId}/ITILSolution`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // getTicketTasks
            if (operation === 'getTicketTasks') {
                const itemId = this.getNodeParameter('itemId', 0);
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/Ticket/${itemId}/TicketTask`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // getUserById
            if (operation === 'getUserById') {
                const userId = this.getNodeParameter('userId', 0);
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/User/${userId}`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // getUserByEmail helper
            if (operation === 'getUserByEmail') {
                const email = this.getNodeParameter('userEmail', 0);
                if (!email)
                    throw new Error('E-mail obrigatório.');
                const qs = `criteria[0][glue]=AND&criteria[0][field]=1&criteria[0][searchtype]=contains&criteria[0][value]=${encodeURIComponent(email)}&range=0-50`;
                const response = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/apirest.php/search/User?${qs}`, headers, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // createTicket (POST /Ticket/)
            if (operation === 'createTicket') {
                const ticketInput = this.getNodeParameter('ticketInput', 0);
                if (!ticketInput || typeof ticketInput !== 'object')
                    throw new Error('ticketInput inválido.');
                const response = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/apirest.php/Ticket/`, headers, body: ticketInput, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // updateTicket (PUT /Ticket/:id)
            if (operation === 'updateTicket') {
                const itemId = this.getNodeParameter('itemId', 0);
                const ticketInput = this.getNodeParameter('ticketInput', 0);
                if (!itemId)
                    throw new Error('itemId obrigatório para updateTicket.');
                if (!ticketInput || typeof ticketInput !== 'object')
                    throw new Error('ticketInput inválido.');
                const response = await this.helpers.request({ method: 'PUT', uri: `${baseUrl}/apirest.php/Ticket/${itemId}`, headers, body: ticketInput, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // addFollowup (POST /Ticket/:id/ITILFollowup)
            if (operation === 'addFollowup') {
                const itemId = this.getNodeParameter('itemId', 0);
                const followupInput = this.getNodeParameter('followupInput', 0);
                if (!itemId)
                    throw new Error('itemId obrigatório para addFollowup.');
                if (!followupInput || typeof followupInput !== 'object')
                    throw new Error('followupInput inválido.');
                const response = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/apirest.php/Ticket/${itemId}/ITILFollowup`, headers, body: followupInput, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            // addSolution (POST /ITILSolution/)
            if (operation === 'addSolution') {
                const solutionInput = this.getNodeParameter('solutionInput', 0);
                if (!solutionInput || typeof solutionInput !== 'object')
                    throw new Error('solutionInput inválido.');
                const response = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/apirest.php/ITILSolution/`, headers, body: solutionInput, json: true });
                returnData.push({ json: response });
                return [returnData];
            }
            throw new Error(`Operação desconhecida: ${operation}`);
        }
        catch (err) {
            returnData.push({
                json: {
                    error: true,
                    message: err.message || String(err),
                    stack: err.stack,
                },
            });
            return [returnData];
        }
    }
}
exports.Glpi = Glpi;
//# sourceMappingURL=Glpi.node.js.map