import logger from "../logger/logger.js";

export interface RetryOptions {
    retries?: number;
    delay?: number;
    factor?: number;
    maxDelay?: number;
}

export class Retry {

    public static async run<T>(
        task: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {

        const retries = options.retries ?? Infinity;
        const factor = options.factor ?? 2;
        const maxDelay = options.maxDelay ?? 60000;

        let delay = options.delay ?? 5000;

        let attempt = 1;

        while (true) {

            try {

                logger.info(`Attempt ${attempt}`);

                return await task();

            } catch (error) {

                logger.warn(`Attempt ${attempt} failed`);

                if (attempt >= retries) {
                    throw error;
                }

                logger.info(`Retrying in ${delay} ms`);

                await this.sleep(delay);

                delay = Math.min(delay * factor, maxDelay);

                attempt++;
            }
        }
    }

    private static sleep(ms: number): Promise<void> {

        return new Promise(resolve => {

            setTimeout(resolve, ms);

        });

    }

}