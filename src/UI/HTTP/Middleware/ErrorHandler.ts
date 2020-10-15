import ConflictException from "Domain/Shared/Exceptions/ConflictException";
import InvalidArgumentException from "Domain/Shared/Exceptions/InvalidArgumentException";
import NotFoundException from "Domain/Shared/Exceptions/NotFoundException";
import type { Request, Response } from "express";
import type {ILog} from "Infrastructure/Shared/Audit/Logger";

export default function errorHandler(logger: ILog) {
    return (err: any, req: Request, res: Response, next: () => void) => {
        switch (true) {
            case (err instanceof InvalidArgumentException):
                res.status(400).send(err.message);
                break;
            case (err instanceof ConflictException):
                res.status(409).send(err.message);
                break;
            case (err instanceof NotFoundException):
                res.status(404).send(err.message);
                break;
            default:
                logger.error(err.message);
                res.status(500).send(`Internal Server Error: ${err.message}`);
        }
    };
}
