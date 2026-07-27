import { describe, expect, it } from "vitest";

import { Container } from "../src/container/Container.js";

describe("Container", () => {
    it("should register and resolve a service", () => {
        const container = new Container();

        container.register("test", () => "hello");

        const result = container.resolve<string>("test");

        expect(result).toBe("hello");
    });

    it("should throw error for missing service", () => {
        const container = new Container();

        expect(() => {
            container.resolve("missing");
        }).toThrow();
    });
});