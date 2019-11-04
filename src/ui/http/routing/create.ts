import { Express, Request, Response } from "express";
import CreateCommand from "../../../application/transaction/create/command";
import App from "../../../infrastructure/shared/app/index";

export default (express: Express, app: App) => express.post(
    "/transaction",
    async (req: Request, res: Response) => {
        const { uuid, product, price } = req.body;

        await app.handle(new CreateCommand(
            uuid,
            product,
            price,
        ));

        res.status(201).send();
    },
);
