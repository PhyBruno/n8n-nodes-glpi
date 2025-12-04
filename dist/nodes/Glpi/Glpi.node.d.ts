import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class Glpi implements INodeType {
    description: INodeTypeDescription;
    private buildBaseAuth;
    private getSessionToken;
    private buildCriteriaQuery;
    execute(this: any): Promise<INodeExecutionData[][]>;
}
