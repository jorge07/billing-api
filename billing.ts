#! /usr/bin/env -S node -r ts-node/register/transpile-only -r tsconfig-paths/register

import "reflect-metadata";
import { program } from "commander";
import AsyncEventBus from "@Apps/Consumers/AsyncEventBus/AsyncEventBus";
import http from "@Apps/HTTP";
import KernelFactory from "./src/Kernel";

program
  .version("1.0.0")
;

program
    .command("queue:consume")
    .description("Consume queues")
    .option("-q, --queue [Queue Name]", "Name of the queue to consume")
    .option("-p, --pattern [Topic pattern]", "Topic filter")
    .option("-l, --limit [Message Limit]", "Define the max number of messages the worker can consume before graceful exit. Default 100")
    .option("-m, --monitor [Monitor]", "Monitoring server")
    .action(async (options) => {
        const kernel = await KernelFactory()
        const bus = new AsyncEventBus(
            kernel,
            options.queue || "events",
            options.pattern || "#",
            options.limit || 1000,
            options.monitor || false,
        );
        await bus.consume();
    })
;

program
    .command("http")
    .description("Start http server")
    .action(async (options) => {
        await http();
    })
;

program.parse(process.argv);
