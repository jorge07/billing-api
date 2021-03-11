import GetOneQuery from "Application/UseCase/Transaction/GetOne/Query";
import { Request, Response } from "express";
import { Framework } from "hollywood-js";
import { IRoute } from "../index";

export default function get(app: Framework.Kernel): IRoute {
    return {
        action: async (req: Request, res: Response) => {
            const { uuid } = req.params;

            const transaction = await app.ask(new GetOneQuery(
                uuid,
            ));

            res.status(200).send(transaction);
        },
        method: "get",
        path: "/transaction/:uuid",
    };
}
