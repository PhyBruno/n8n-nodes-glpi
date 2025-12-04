"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discord = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const DiscordV1_node_1 = require("./v1/DiscordV1.node");
const DiscordV2_node_1 = require("./v2/DiscordV2.node");
class Discord extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Discord',
            name: 'discord',
            icon: 'file:discord.svg',
            group: ['output'],
            defaultVersion: 2,
            description: 'Sends data to Discord',
        };
        const nodeVersions = {
            1: new DiscordV1_node_1.DiscordV1(baseDescription),
            2: new DiscordV2_node_1.DiscordV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Discord = Discord;
//# sourceMappingURL=Discord.node.js.map