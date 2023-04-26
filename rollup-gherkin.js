import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/gherkin.umd.js",
    output: {
        file: "src/gherkin.js",
        format: "es",
    },
    plugins: [commonjs()],
};
