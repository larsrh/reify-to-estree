import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/index.es.js",
        format: "esm"
    },
    plugins: [
        resolve({ extensions: [".js", ".ts"] }),
        sucrase({
            exclude: [`${root}/node_modules/**`],
            transforms: ["typescript"]
        })
    ]
};
