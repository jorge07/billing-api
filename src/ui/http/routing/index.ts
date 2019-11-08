import { Request, Response } from "express";
import App from "../../../infrastructure/shared/app/index";
import get from "./transaction/get";
import create from "./transaction/post";

type Context = (app: App) => IRoute;

export interface IRoute {
    path: string;
    method: string;
    action: (req: Request, res: Response) => Promise<void>;
}

export const routes: Context[] = [
    get,
    create,
];
