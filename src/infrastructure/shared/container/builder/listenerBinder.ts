import { Container } from 'inversify';
import { IContainerServiceItem } from '../../../../../config/container/items/service';
import { EventStore } from 'hollywood-js';

export default function listenerBinder(container: Container, serviceDefinition: IContainerServiceItem, key: string) {
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
