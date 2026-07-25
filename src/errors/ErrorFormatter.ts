import { FrameworkError } from "./FrameworkError.js";

export class ErrorFormatter {
    public static format(error: FrameworkError): string {
        const lines: string[] = [];

        lines.push("══════════════════════════════════════════════════════");
        lines.push("Framework Error");
        lines.push("══════════════════════════════════════════════════════");
        lines.push("");

        lines.push(`Code      : ${error.code}`);
        lines.push(`Type      : ${error.name}`);
        lines.push(`Message   : ${error.message}`);

        if (error.file) {
            lines.push(`File      : ${error.file}`);
        }

        if (error.line) {
            lines.push(`Line      : ${error.line}`);
        }

        if (error.hint) {
            lines.push(`Hint      : ${error.hint}`);
        }

        if (process.env.NODE_ENV === "development") {
            if (error.stack) {
                lines.push("");
                lines.push("Stack");
                lines.push("-----");
                lines.push(error.stack);
            }
        }

        return lines.join("\n");
    }
}
