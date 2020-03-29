import CreateCommand from "application/useCase/transaction/create/command";
import { Express, Request, Response } from "express";
import { Framework } from "hollywood-js";
import { IRoute } from "../index";

export default function create(app: Framework.AppBridge): IRoute {
    return {
        action: async (req: Request, res: Response) => {
            const { uuid, product, price } = req.body;

            await app.handle(new CreateCommand(
                uuid,
                product,
                price,
            ));

            res.status(201).send();
        },
        method: "post",
        path: "/transaction",
    };
}
