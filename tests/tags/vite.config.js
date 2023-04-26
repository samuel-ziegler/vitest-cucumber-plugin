import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

export default defineConfig({
    plugins: [vitestCucumberPlugin()],
    test: {
        include : [ '**/*.feature' ],
        cucumber : {
            tags : "not (@skip or @yuck) or (@yuck and @goodstuff)",
        },
    },
})
