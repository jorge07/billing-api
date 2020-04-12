import GetOne from "application/useCase/transaction/get/query";
import { Request, Response } from "express";
import { Framework } from "hollywood-js";
import { IRoute } from "../index";

export default function get(app: Framework.AppBridge): IRoute {
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
