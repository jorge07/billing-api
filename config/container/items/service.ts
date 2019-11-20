import { interfaces } from 'inversify';
import { Domain } from 'hollywood-js';

export type Listener = {
    bus: string
    listener?: boolean
}

export type Subscriber = Listener & {
    subscriber: any[]
}

export interface IContainerServiceItem extends Partial<Subscriber> {
    instance?: any
    collection?: any[]
    custom?: (context: interfaces.Context) => any
    containerAware?: boolean
    async?: () => any
    constant?: boolean
}

export type ServiceList = Map<string, IContainerServiceItem>; 