import { ContainerError } from "../errors/index.js";
import type { Command } from "../interfaces/Command.js";

export const commands = new Map<string, Command>();

type Factory<T> = () => T;

interface Registration<T> {
    factory: Factory<T>;
    singleton: boolean;
    instance?: T;
}

export class Container {
    private readonly services = new Map<string, Registration<unknown>>();

    public register<T>(token: string, factory: Factory<T>, singleton = true): void {
        this.services.set(token, {
            factory,
            singleton,
        });
    }

    public resolve<T>(token: string): T {
        const registration = this.services.get(token);

        if (!registration) {
            throw new ContainerError(`Service '${token}' is not registered.`);
        }

        if (registration.singleton) {
            if (registration.instance === undefined) {
                registration.instance = registration.factory();
            }

            return registration.instance as T;
        }

        return registration.factory() as T;
    }

    public has(token: string): boolean {
        return this.services.has(token);
    }

    public remove(token: string): void {
        this.services.delete(token);
    }

    public clear(): void {
        this.services.clear();
    }

    public get size(): number {
        return this.services.size;
    }
}
