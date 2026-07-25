import type { Command } from "../interfaces/Command.js";
import { CommandLoadError } from "../errors/index.js";

export class CommandValidator {
    public static validate(command: unknown, file: string): asserts command is Command {
        if (!command) {
            throw new CommandLoadError("Command export is missing.", file);
        }

        if (typeof command !== "object") {
            throw new CommandLoadError("Command must be an object.", file);
        }

        if (!("data" in command)) {
            throw new CommandLoadError("Command is missing 'data'.", file);
        }

        if (!("execute" in command)) {
            throw new CommandLoadError("Command is missing 'execute'.", file);
        }

        if (typeof (command as Command).execute !== "function") {
            throw new CommandLoadError("Command execute must be a function.", file);
        }

        if (!(command as Command).data?.name) {
            throw new CommandLoadError("Command name is missing.", file);
        }
    }
}
