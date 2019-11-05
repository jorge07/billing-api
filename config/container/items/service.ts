import { interfaces } from 'inversify';
import { Domain } from 'hollywood-js';

export interface IContainerServiceItem {
    instance?: any
    collection?: any[]
    custom?: (context: interfaces.Context) => any
    listener?: boolean
    subscriber?: Domain.DomainEvent
}

export type ServiceList = Map<string, IContainerServiceItem>; 