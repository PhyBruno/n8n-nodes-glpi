"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.glpiFields = exports.glpiOperations = void 0;
exports.glpiOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
            { name: 'Init Session', value: 'initSession' },
            { name: 'Add Solution', value: 'addSolution' },
            { name: 'Search', value: 'search' },
        ],
        default: 'search',
    },
];
exports.glpiFields = [
    {
        displayName: 'Criteria',
        name: 'criteria',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Criterion',
        description: 'One or more criteria for the search',
        options: [
            {
                displayName: 'Criterion',
                name: 'criterion',
                values: [
                    { displayName: 'Field', name: 'field', type: 'string', default: '' },
                    {
                        displayName: 'Search Type',
                        name: 'searchtype',
                        type: 'options',
                        options: [
                            { name: 'contains', value: 'contains' },
                            { name: 'equals', value: 'equals' },
                        ],
                        default: 'contains',
                    },
                    { displayName: 'Value', name: 'value', type: 'string', default: '' },
                    {
                        displayName: 'Glue',
                        name: 'glue',
                        type: 'options',
                        options: [
                            { name: 'AND', value: 'AND' },
                            { name: 'OR', value: 'OR' },
                        ],
                        default: 'AND',
                    },
                ],
            },
        ],
        default: [],
        displayOptions: {
            show: {
                operation: ['search'],
            },
        },
    },
    {
        displayName: 'Solution Data',
        name: 'solutionData',
        type: 'string',
        default: '',
        placeholder: '{"name":"Solution name", "content":"..."}',
        displayOptions: {
            show: {
                operation: ['addSolution'],
            },
        },
        description: 'JSON body for adding a solution',
    },
];
//# sourceMappingURL=Glpi.descriptions.js.map