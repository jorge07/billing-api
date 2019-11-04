import { interfaces } from 'inversify';

export interface IContainerServiceItem {
    instance?: any
    collection?: any[]
    custom?: (context: interfaces.Context) => any
}

export type ServiceList = Map<string, IContainerServiceItem>; 