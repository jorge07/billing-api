#! /usr/bin/env node -r ts-node/register -r tsconfig-paths/register

import { program } from "commander";
import AsyncEventBus from "./asyncEventBus/asyncEventBus";

program
  .version("1.0.0")
;

program
  .command("queue:consume")
  .description("Consume queues")
  .option("-q, --queue [Queue Name]", "Name of the queue to consume")
  .option("-p, --pattern [Topic pattern]", "Topic filter")
  .option("-m, --monitor [Moitor]", "Moitoring server")
  .action(async (options) => {
    const bus = new AsyncEventBus(
        options.queue || "events",
        options.pattern || "#",
        options.monnitor || false,
    );
    await bus.consume();
  });

program.parse(process.argv);

