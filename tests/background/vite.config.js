import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

export default defineConfig(({ mode }) => {
    const level = (mode === 'test-debug') ? 'debug' : 'warn';
    return {
        plugins: [vitestCucumberPlugin()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { log : { level } },
        },
    }
});
