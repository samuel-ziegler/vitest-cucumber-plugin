import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/gherkin.umd.js",
    output: {
        file: "src/gherkin.js",
        format: "es",
    },
    external : [ 'moo', 'lodash/fp.js', './gherkin-lexer-shared.cjs' ],
    plugins: [commonjs()],
};
