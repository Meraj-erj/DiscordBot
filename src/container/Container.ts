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

    public resolve<T>(name: string): T {

        const service = this.services.get(name);

        if (!service) {

            throw new Error(
                `Service "${name}" is not registered.`
            );

        }

        return service as T;

    }

    public has(name: string): boolean {

        return this.services.has(name);

    }

    public remove(name: string): boolean {

        return this.services.delete(name);

    }

    public clear(): void {

        this.services.clear();

    }

}