import { Express, Request, Response } from "express";
import GetOne from "../../../../application/transaction/get/query";
import { IRoute } from "../index";
import App from '../../../../application/index';

export default function get(app: App): IRoute {
    return {
        action: async (req: Request, res: Response) => {
            const { uuid } = req.params;

            const transaction = await app.ask(new GetOne(
                uuid,
            ));

            res.status(200).send(transaction);
        },
        method: "get",
        path: "/transaction/:uuid",
    };
}
