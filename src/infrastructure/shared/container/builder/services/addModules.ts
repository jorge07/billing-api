import { AsyncContainerModule, interfaces } from "inversify";
import { IContainerServiceItem, ServiceList } from "../../../../../../config/container/items/service";

export default function addModules(serviceList: ServiceList, modules: AsyncContainerModule[]): void {
    for (const serviceDefinitionItem of serviceList) {
        modules.push(module(serviceDefinitionItem[1], serviceDefinitionItem[0]));
    }
}

function module(serviceDefinition: IContainerServiceItem, key: string): AsyncContainerModule {
    return new AsyncContainerModule(async (
        bind: interfaces.Bind,
        unbind: interfaces.Unbind,
        isBound: interfaces.IsBound,
        rebind: interfaces.Rebind,
    ) => {
         if (serviceDefinition.collection) {
            serviceDefinition.collection.forEach((item: any) => {
                bind(key).to(item).inSingletonScope();
            });

        } else if (serviceDefinition.collection) {

            serviceDefinition.collection.forEach((item: any) => {
                bind(key).to(item).inSingletonScope();
            });

        } else if (serviceDefinition.async) {
            const service = await serviceDefinition.async();
            if (serviceDefinition.constant) {
                bind(key).toConstantValue(service);
            } else {
                bind(key).to(service).inSingletonScope();
            }

        } else if (serviceDefinition.custom) {
            bind(key).toDynamicValue(serviceDefinition.custom).inSingletonScope();

        } else {
            bind(key).to(serviceDefinition.instance).inSingletonScope();
        }
    });
}
