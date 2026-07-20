import { Bootstrap } from "./bootstrap.js";

export class Application {
    private readonly bootstrap: Bootstrap;

    constructor() {
        this.bootstrap = new Bootstrap();
    }

    public async start(): Promise<void> {
        await this.bootstrap.initialize();
    }

    public async shutdown(): Promise<void> {
        await this.bootstrap.shutdown();
    }
}