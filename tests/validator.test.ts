import { describe, expect, it } from "vitest";

import { CommandValidator } from "../src/validators/CommandValidator.js";
import { EventValidator } from "../src/validators/EventValidator.js";

describe("Validators", () => {
    it("should validate a correct command", () => {
        const command = {
            data: {
                name: "ping",
            },
            execute: async () => {},
        };

        expect(() => {
            CommandValidator.validate(command, "command.test.ts");
        }).not.toThrow();
    });

    it("should reject an invalid command", () => {
        const command = {
            data: {},
        };

        expect(() => {
            CommandValidator.validate(command, "command.test.ts");
        }).toThrow();
    });

    it("should validate a correct event", () => {
        const event = {
            name: "ready",
            execute: async () => {},
        };

        expect(() => {
            EventValidator.validate(event, "event.test.ts");
        }).not.toThrow();
    });

    it("should reject an invalid event", () => {
        const event = {
            name: "",
        };

        expect(() => {
            EventValidator.validate(event, "event.test.ts");
        }).toThrow();
    });
});
