import { Container } from "inversify";
import { ParametersList } from "../../../../config/container/items/parameter";
import { ServiceList } from "../../../../config/container/items/service";
import parametersBinder from "./builder/parameterBinder";
import serviceBinder from "./builder/serviceBinder";

export default function configureContainer(
    container: Container,
    services: ServiceList,
    parameters: ParametersList,
): void {
    parametersBinder(container, parameters);
    serviceBinder(container, services);
}
