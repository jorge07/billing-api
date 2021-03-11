import type { Request, Response } from "express";
import type { Framework } from "hollywood-js";
import type { IRoute } from "../index";

export default function get(app: Framework.Kernel): IRoute {
    return {
        action: async (req: Request, res: Response) => {
            res.status(200).send("UP");
        },
        method: "get",
        path: "/monitor/health",
    };
}
