import { Express, Request, Response } from "express";
import CreateCommand from "../../../../application/transaction/create/command";
import { IRoute } from "../index";
import App from '../../../../application/index';

export default function create(app: App): IRoute {
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
