import { Express, Request, Response } from "express";
import GetOne from "../../../application/transaction/get/query";
import App from "../../../infrastructure/shared/app/index";

export default (express: Express, app: App) => express.get(
    "/transaction/:uuid",
    async (req: Request, res: Response) => {
        const { uuid } = req.params;

        try {
            const transaction = await app.ask(new GetOne(
                uuid,
            ));

            res.status(200).send(transaction);
        } catch (err) {
            res.status(404).send(err.message);
        }
    },
);
