import { AsyncContainerModule, interfaces } from "inversify";
import { IContainerServiceItem, ServiceList } from "../../../../../config/container/items/service";
import attachListenersAndSubscribers from './services/attachListenerAndSubscribers';
import addModules from "infrastructure/shared/container/builder/services/addModules";

export default async function serviceBinder(container: interfaces.Container, services: ServiceList): Promise<void> {
    const modules = [];
    addModules(services, modules);
    await container.loadAsync(...modules);
    attachListenersAndSubscribers(services, container);
}
