import { Domain, EventSourcing } from "hollywood-js";

export class EventCollectorListener extends EventSourcing.EventListener {
    public readonly collected: Domain.DomainEvent[] = [];
    public on(message: Domain.DomainMessage): void {
        this.collected.push(message.event as Domain.DomainEvent);
    }
}
