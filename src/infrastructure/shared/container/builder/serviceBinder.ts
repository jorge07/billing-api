import listenerBinder from './listenerBinder';
import { Container } from 'inversify';
import { ServiceList, IContainerServiceItem } from '../../../../../config/container/items/service';

export default function serviceBinder(container: Container, services: ServiceList): void {

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
            listenerBinder(container, serviceDefinition, key);
            return;
        }
    });
}
