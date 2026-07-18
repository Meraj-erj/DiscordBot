export class Container {

    private readonly services = new Map<string, unknown>();

    public register<T>(name: string, instance: T): void {

        if (this.services.has(name)) {
            throw new Error(
                `Service "${name}" is already registered.`
            );
        }

        this.services.set(name, instance);

    }

}