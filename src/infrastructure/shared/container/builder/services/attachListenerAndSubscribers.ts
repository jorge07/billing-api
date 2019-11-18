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
    if (serviceDefinition.listener) {
        container.get<EventStore.EventBus>("infrastructure.eventBus").addListener(container.get(key));
    }

    if (serviceDefinition.subscriber) {
        serviceDefinition.subscriber.forEach((event: Domain.DomainEvent) => {
            container.get<EventStore.EventBus>("infrastructure.eventBus").attach(
                event,
                container.get(key),
            );
        });
    }
}
