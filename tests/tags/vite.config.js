import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

export default defineConfig({
    plugins: [vitestCucumberPlugin({ tags : "not (@skip or @yuck) or (@yuck and @goodstuff)" })],
    test: {
        include : [ '**/*.feature' ],
    },
})
