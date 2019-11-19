import { Domain, EventStore } from "hollywood-js";
import { interfaces } from "inversify";
import { IContainerServiceItem, ServiceList } from "../../../../../../config/container/items/service";

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
    if (!serviceDefinition.bus) {
        throw new Error(`Missing bus parameter in Service tags for: ${key}`);
    }

    if (serviceDefinition.listener) {
        container.get<EventStore.EventBus>(serviceDefinition.bus).addListener(container.get(key));
    }

    if (serviceDefinition.subscriber) {
        for (const index in serviceDefinition.subscriber) {
            if (serviceDefinition.subscriber.hasOwnProperty(index)) {
                const event: Domain.DomainEvent = serviceDefinition.subscriber[index];
                container.get<EventStore.EventBus>(serviceDefinition.bus).attach(
                    event,
                    container.get(key),
                );
            }
        }
    }
}
