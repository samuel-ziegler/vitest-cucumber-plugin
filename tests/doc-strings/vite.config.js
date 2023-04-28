import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

export default defineConfig(({ mode }) => {
    const logLevel = (mode === 'test-debug') ? 'info' : 'warn';
    return {
        plugins: [vitestCucumberPlugin()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { logLevel },
        },
    }
});
