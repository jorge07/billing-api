#! /usr/bin/env -S node -r ts-node/register -r tsconfig-paths/register

import "reflect-metadata";
import { program } from "commander";
import AsyncEventBus from "./src/Apps/Consumers/AsyncEventBus/AsyncEventBus";
import http from "./src/Apps/HTTP";
import KernelFactory from "./src/Kernel";

program
  .version("1.0.0")
;

program
    .command("queue:consume")
    .description("Consume queues")
    .option("-q, --queue [Queue Name]", "Name of the queue to consume")
    .option("-p, --pattern [Topic pattern]", "Topic filter")
    .option("-m, --monitor [Monitor]", "Monitoring server")
    .action(async (options) => {
        const kernel = await KernelFactory()
        const bus = new AsyncEventBus(
            kernel,
            options.queue || "events",
            options.pattern || "#",
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
