import { Express, Response, Request } from 'express';
import App from '../../../infrastructure/shared/app/index';
import CreateCommand from '../../../application/transaction/create/command';

export default ({ post }: Express, { handle }: App) => post("/transaction", async (req: Request, res: Response) => {
    const { uuid, product, price } = req.body;

    await handle(new CreateCommand(
        uuid,
        product,
        price,
    ));

    res.status(201).send();
});