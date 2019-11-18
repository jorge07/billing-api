import LoggerMiddleware from 'application/middlewares/loggerMiddleware';
import { ILog } from 'infrastructure/shared/audit/logger';

class FakeLog implements ILog {
    public counter: number = 0
    public last: string = "";
    info(message: string, ...meta: any[]): void {
        this.counter++;
        this.last = "info";
    }

    warn(message: string, ...meta: any[]): void {
        this.counter++;
        this.last = "warn";
    }

    error(message: string, ...meta: any[]): void {
        this.counter++;
        this.last = "error";
    }
}
describe("Test LoggerMiddleware", () => {
    let middleware: LoggerMiddleware;
    let fakeLogger: FakeLog;
    
    beforeEach(() => {
        fakeLogger = new FakeLog();
        middleware = new LoggerMiddleware(fakeLogger);
    })

    test("Hit twice on success", async () => {
        await middleware.execute({random: "", }, () => {});
        expect(fakeLogger.counter).toBe(2);
        expect(fakeLogger.last).toBe("info");
    });
});