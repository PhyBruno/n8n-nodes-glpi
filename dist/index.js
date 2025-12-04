"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = exports.nodes = exports.GlpiApi = exports.Glpi = void 0;
const Glpi_node_1 = require("./nodes/Glpi/Glpi.node");
Object.defineProperty(exports, "Glpi", { enumerable: true, get: function () { return Glpi_node_1.Glpi; } });
const GlpiApi_credentials_1 = require("./nodes/Glpi/GlpiApi.credentials");
Object.defineProperty(exports, "GlpiApi", { enumerable: true, get: function () { return GlpiApi_credentials_1.GlpiApi; } });
// Exports explícitos que o n8n busca ao carregar pacotes externos
exports.nodes = [Glpi_node_1.Glpi];
exports.credentials = [GlpiApi_credentials_1.GlpiApi];
//# sourceMappingURL=index.js.map