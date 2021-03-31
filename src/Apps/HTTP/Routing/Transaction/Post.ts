import CreateCommand from "@Transaction/Application/Create/Command";
import { Request, Response } from "express";
import { Application } from "hollywood-js";
import { IRoute } from "../index";

export default function create(app: Application.App): IRoute {
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
