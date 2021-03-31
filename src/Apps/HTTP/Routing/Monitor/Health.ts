import type { Request, Response } from "express";
import type { IRoute } from "../index";

export default function get(): IRoute {
    return {
        action: async (req: Request, res: Response) => {
            res.status(200).send("UP");
        },
        method: "get",
        path: "/monitor/health",
    };
}
