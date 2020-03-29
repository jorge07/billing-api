import InvalidArgumentException from "domain/shared/exceptions/invalidArgumentException";
import NotFoundException from "domain/shared/exceptions/notFoundException";
import { Express, Request, Response } from "express";
import ConflictException from "../../../domain/shared/exceptions/ConflictException";

export default function errorHandler(err: any, req: Request, res: Response, next: () => void) {
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
            res.status(500).send("Internal Server Error.");
    }
}
