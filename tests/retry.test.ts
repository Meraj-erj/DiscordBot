import { describe, expect, it, vi } from "vitest";

import { Retry } from "../src/utils/Retry.js";

describe("Retry", () => {
    it("should succeed without retry", async () => {
        const task = vi.fn().mockResolvedValue("success");

        const result = await Retry.run(task, {
            retries: 3,
            delay: 10,
        });

        expect(result).toBe("success");
        expect(task).toHaveBeenCalledTimes(1);
    });

    it("should retry when task fails", async () => {
        const task = vi
            .fn()
            .mockRejectedValueOnce(new Error("failed"))
            .mockResolvedValue("success");

        const result = await Retry.run(task, {
            retries: 3,
            delay: 10,
        });

        expect(result).toBe("success");
        expect(task).toHaveBeenCalledTimes(2);
    });

    it("should throw error after maximum retries", async () => {
        const task = vi.fn().mockRejectedValue(new Error("failed"));

        await expect(
            Retry.run(task, {
                retries: 3,
                delay: 10,
            })
        ).rejects.toThrow("failed");

        expect(task).toHaveBeenCalledTimes(3);
    });
});