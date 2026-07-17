import { Collection } from "discord.js";
import type { Command } from "../interfaces/Command.js";
export const commands = new Collection<string, Command>();