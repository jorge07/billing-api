import InMemoryMiddlewareCache from '../../../../src/application/middlewares/InMemoryMiddlewareCache';
import CreateCommand from '../../../../src/application/transaction/create/command';

describe("Cache middleware test", () => {

    const middelware = new InMemoryMiddlewareCache();

    beforeEach(()=> middelware.flush());

    test("Cache Miss", async () => {
        let hit = false;

        const exec = async () => {
            return await middelware.execute(new CreateCommand("1", "2", { amount: 1, currency: "EUR"}), ( ) => {
                hit = true
                return "test";
            });
        };

        expect(await exec()).toBe("test");
        expect(hit).toBe(true);
    });

    test("Cache Hit", async () => {
        let hit = false;

        await middelware.execute(new CreateCommand("1", "2", { amount: 1, currency: "EUR"}), ( ) => ("test"));
        
        const exec = async () => {
            return await middelware.execute(new CreateCommand("1", "2", { amount: 1, currency: "EUR"}), ( ) => {
                hit = true
                return "Nope!";
            });
        };

        expect(await exec()).toBe("test");
        expect(hit).toBe(false);
    });
});