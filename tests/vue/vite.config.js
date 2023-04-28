import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const level = (mode === 'test-debug') ? 'info' : 'warn';
    return {
        plugins: [vue(),vitestCucumberPlugin()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { log : { level } },
            environment : 'jsdom',
        },
    }
});
