import { Container } from "./Container.js";

export class ServiceRegistry {
    private readonly container = new Container();

    public getContainer(): Container {
        return this.container;
    }
}
