import { Glpi } from './nodes/Glpi/Glpi.node';
import { GlpiApi } from './nodes/Glpi/GlpiApi.credentials';

export { Glpi, GlpiApi };

// Exports explícitos que o n8n busca ao carregar pacotes externos
export const nodes = [Glpi];
export const credentials = [GlpiApi];
