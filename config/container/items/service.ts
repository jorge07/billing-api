import { interfaces } from 'inversify';
import { Domain } from 'hollywood-js';

export interface IContainerServiceItem {
    instance?: any
    collection?: any[]
    custom?: (context: interfaces.Context) => any
    containerAware?: boolean
    listener?: boolean
    subscriber?: any[]
    async?: () => any
    constant?: boolean
}

export type ServiceList = Map<string, IContainerServiceItem>; 