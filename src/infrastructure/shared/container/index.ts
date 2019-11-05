import { EventStore } from "hollywood-js";
import { Container, decorate, injectable } from "inversify";
import { IContainerParameterItem, ParametersList } from "../../../../config/container/items/parameter";
import { IContainerServiceItem, ServiceList } from "../../../../config/container/items/service";

decorate(injectable(), EventStore.InMemoryEventStore);
decorate(injectable(), EventStore.InMemorySnapshotStoreDBAL);
decorate(injectable(), EventStore.EventListener);
decorate(injectable(), EventStore.EventSubscriber);
decorate(injectable(), EventStore.EventStore);
decorate(injectable(), EventStore.EventBus);

function bindParameters(container: Container, parameters: ParametersList): void {
    parameters.forEach(
        (parameter: IContainerParameterItem, key: string) => container.bind(key).toConstantValue(parameter.value),
    );
}

function eventListenerOrSubscriber(container: Container, serviceDefinition: IContainerServiceItem, key: string) {
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

function bindServices(container: Container, services: ServiceList): void {

    services.forEach((serviceDefinition: IContainerServiceItem, key: string) => {
        if (serviceDefinition.custom) {

            container.bind(key).toDynamicValue(serviceDefinition.custom).inSingletonScope();

        } else if (serviceDefinition.collection) {

            serviceDefinition.collection.forEach((item: any) => {
                container.bind(key).to(item).inSingletonScope();
            });

        } else {

            container.bind(key).to(serviceDefinition.instance).inSingletonScope();
        }

        if (serviceDefinition.listener || serviceDefinition.subscriber) {
            eventListenerOrSubscriber(container, serviceDefinition, key);
            return;
        }
    });
}

export default function configureContainer(
    container: Container,
    services: ServiceList,
    parameters: ParametersList,
): void {
    bindParameters(container, parameters);
    bindServices(container, services);
}
