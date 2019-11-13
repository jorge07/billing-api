import { Request, Response } from "express";
import get from "./transaction/get";
import create from "./transaction/post";
import App from '../../../application/index';

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
