import { interfaces } from "inversify";
import { IContainerParameterItem, ParametersList } from "../../../../../config/container/items/parameter";

export default function parameterBinder(container: interfaces.Container, parameters: ParametersList): void {
    parameters.forEach((parameter: IContainerParameterItem, key: string) => {
        container.bind(key).toConstantValue(parameter.value);
    });
}
