import { interfaces } from 'inversify';
import { ServiceList, IContainerServiceItem } from '../../../../../../config/container/items/service';
import { EventStore } from 'hollywood-js';

export default function attachListenersAndSubscribers(serviceList: ServiceList, container: interfaces.Container): void {
    for (const serviceDefinitionItem of serviceList) {
        if (serviceDefinitionItem[1].listener || serviceDefinitionItem[1].subscriber) {
            listenerBinder(container, serviceDefinitionItem[1], serviceDefinitionItem[0]);
        }
    }
}
function listenerBinder(
    container: interfaces.Container,
    serviceDefinition: IContainerServiceItem,
    key: string,
) {
    if (serviceDefinition.listener) {
        container.get<EventStore.EventBus>("infrastructure.eventBus").addListener(container.get(key));
    }

    if (serviceDefinition.subscriber) {
        container.get<EventStore.EventBus>("infrastructure.eventBus").attach(
            serviceDefinition.subscriber,
            container.get(key),
        );
    }
}
