import { Container, interfaces } from "inversify";
import { ParametersList } from "../../../../config/container/items/parameter";
import { ServiceList } from "../../../../config/container/items/service";
import parametersBinder from "./builder/parameterBinder";
import serviceBinder from "./builder/serviceBinder";

export default async function configureContainer(
    services: ServiceList,
    parameters: ParametersList,
): Promise<interfaces.Container> {
    const container: interfaces.Container = new Container();

    parametersBinder(container, parameters);
    await serviceBinder(container, services);

    return container;
}
