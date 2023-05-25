import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

export default defineConfig(({ mode }) => {
    const level = (mode === 'test-debug') ? 'debug' : 'warn';
    return {
        plugins: [vitestCucumberPlugin({ log : { level } })],
        test: {
            include : [ '**/*.feature' ],
        },
    }
});
