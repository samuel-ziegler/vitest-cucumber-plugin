import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const level = (mode === 'test-debug') ? 'debug' : 'warn';
    return {
        plugins: [vue(), vitestCucumberPlugin({ log : { level } })],
        test: {
            include : [ '**/*.feature' ],
            environment : 'jsdom',
        },
    }
});
