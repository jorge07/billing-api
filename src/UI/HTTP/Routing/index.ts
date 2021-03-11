import { Request, Response } from "express";
import { Framework } from "hollywood-js";
import health from "./Monitor/Health";
import get from "./Transaction/Get";
import create from "./Transaction/Post";

type Context = (app: Framework.Kernel) => IRoute;

export interface IRoute {
    path: string;
    method: string;
    action: (req: Request, res: Response) => Promise<void>;
}

export const routes: Context[] = [
    get,
    create,
    health,
];
