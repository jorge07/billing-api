import { Request, Response } from "express";
import { Application } from "hollywood-js";
import health from "./Monitor/Health";
import get from "./Transaction/Get";
import create from "./Transaction/Post";

type Context = (app: Application.App) => IRoute;

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
