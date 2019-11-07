import { Express, Request, Response } from "express";
import App from '../../../../infrastructure/shared/app/index';
import CreateCommand from '../../../../application/transaction/create/command';

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
