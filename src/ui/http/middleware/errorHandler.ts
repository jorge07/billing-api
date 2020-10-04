import ConflictException from "domain/shared/exceptions/ConflictException";
import InvalidArgumentException from "domain/shared/exceptions/InvalidArgumentException";
import NotFoundException from "domain/shared/exceptions/NotFoundException";
import type { Request, Response } from "express";
import type {ILog} from "infrastructure/shared/audit/logger";

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
