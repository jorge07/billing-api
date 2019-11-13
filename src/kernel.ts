import * as config from "config";
import { Container, interfaces } from "inversify";
import { ServiceList } from "../config/container/items/service";
import { parameters } from "../config/container/parameters";
import { services } from "../config/container/services";
import { testServices } from "../config/container/test";
import configureContainer from "./infrastructure/shared/container/index";
import HTTPServer from "./ui/http/server";
import App from './application/index';

export class Kernel {
    public readonly app: App;
    public readonly http: HTTPServer;
    private readonly projectDir: string;

    constructor(
        private readonly debug: boolean = false,
        public readonly container: Container,
    ) {
        this.projectDir = process.env.PWD || "";
        this.app = this.container.get<App>("app");
        this.http = this.container.get<HTTPServer>("ui.httpServer");
    }
}

async function createContainer(): Promise<interfaces.Container> {
    let servicesMap: ServiceList = services;

    if (config.get<string>("env") === "test") {
        servicesMap = new Map([...services, ...testServices]);
    }

    return await configureContainer(servicesMap, parameters);
}

export default async function KernelFactory(debug: boolean): Promise<Kernel> {
    const container: any = await createContainer();
    return new Kernel(debug, container);
}
