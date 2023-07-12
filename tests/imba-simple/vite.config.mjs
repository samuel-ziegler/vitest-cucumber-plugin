import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';
import imbaPlugin from 'imba/plugin'

export default defineConfig(({ mode }) => {
    const level = (mode === 'test-debug') ? 'info' : 'warn';
    return {
		plugins: [imbaPlugin({ssr: false}), vitestCucumberPlugin()],
		resolve:{
			extensions: ['.imba', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
		},
		test: {
			environment: "jsdom",
            include : [ '**/*.feature' ],
            cucumber : { log : { level } },
			setupFiles: ["./setup.imba"],
			globals: true
        },
    }
});
