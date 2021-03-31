import GetOneQuery from "@Transaction/Application/GetOne/Query";
import { Request, Response } from "express";
import { Application } from "hollywood-js";
import { IRoute } from "../index";

export default function get(app: Application.App): IRoute {
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
