import { Domain, EventStore } from "hollywood-js";

export default class EventCollectorListener extends EventStore.EventListener {
    public readonly collected: Domain.DomainEvent[] = [];
    public on(message: Domain.DomainMessage): void {
        this.collected.push(message.event as Domain.DomainEvent);
    }
}
