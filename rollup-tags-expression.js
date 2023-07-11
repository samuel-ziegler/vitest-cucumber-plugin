import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/tags-expression.umd.js",
    output: {
        file: "src/tags-expression.js",
        format: "es",
    },
    external : [ 'moo', 'lodash/fp.js' ],
    plugins: [commonjs()],
};
