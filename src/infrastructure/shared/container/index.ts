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

function bindServices(container: Container, services: ServiceList): void {

    services.forEach((serviceDefinition: IContainerServiceItem, key: string) => {
        if (serviceDefinition.custom) {
            container.bind(key).toDynamicValue(serviceDefinition.custom).inSingletonScope();
            return;
        }
        if (serviceDefinition.collection) {
            serviceDefinition.collection.forEach((item: any) => {
                container.bind(key).to(item).inSingletonScope();
            });
            return;
        }
        container.bind(key).to(serviceDefinition.instance).inSingletonScope();
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
