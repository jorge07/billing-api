import { Express, Response, Request } from 'express';
import App from '../../../infrastructure/shared/app/index';
import GetOne from '../../../application/transaction/get/query';

export default ({ get }: Express, { handle }: App) => get("/transaction/:uuid", async (req: Request, res: Response) => {
    const { uuid } = req.params;

    try {
        const transaction = await handle(new GetOne(
            uuid
        ));

        res.status(200).send(transaction);
    } catch(err) {
        res.status(404).send(err.message);
    }
});
