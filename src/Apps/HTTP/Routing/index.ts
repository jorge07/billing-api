import type {FastifyReply, FastifyRequest} from "fastify";
import type { Application } from "hollywood-js";
import health from "./Monitor/Health";
import get from "./Transaction/Get";
import { confirm, fail, refund } from "./Transaction/Patch";
import create from "./Transaction/Post";

type Context = (app: Application.App) => IRoute;

export interface IRoute {
    path: string;
    method: string;
    options?: object;
    action: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
}

export const routes: Context[] = [
    confirm,
    create,
    fail,
    get,
    health,
    refund,
];
