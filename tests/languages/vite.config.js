import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

export default defineConfig(({ mode }) => {
    const level = (mode === 'test-debug') ? 'info' : 'warn';
    return {
        plugins: [vitestCucumberPlugin()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { language : 'no' },
        },
    }
});
