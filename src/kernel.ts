import config from "config";
import { Container } from "inversify";
import { IContainerServiceItem, ServiceList } from "../config/container/items/service";
import { parameters } from "../config/container/parameters";
import { services } from "../config/container/services";
import { testServices } from "../config/container/test";
import App from "./infrastructure/shared/app/";
import configureContainer from "./infrastructure/shared/container/index";
import HTTPServer from "./ui/http/server";

export default class Kernel {
    public readonly app: App;
    public readonly container: Container;
    public readonly http: HTTPServer;

    private readonly config: config.IConfig;
    private readonly projectDir: string;

    constructor(
        private readonly debug: boolean = false,
    ) {
        this.projectDir = process.env.PWD || "";
        this.config = config;
        this.container = new Container();
        this.build();
        this.app = this.container.get<App>("app");
        this.http = this.container.get<HTTPServer>("ui.httpServer");
    }

    private build() {
        let servicesMap: ServiceList = services;
        if (config.get<string>("env") === "test") {
            servicesMap = new Map([...services, ...testServices]);
        }
        configureContainer(this.container, servicesMap, parameters);
    }
}
