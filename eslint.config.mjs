import pluginTypescript from "@typescript-eslint/eslint-plugin";
import parserTypescript from "@typescript-eslint/parser";
import fioriToolsPlugin from "@sap-ux/eslint-plugin-fiori-tools";

export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: parserTypescript,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json"
            }
        },
        plugins: {
            "@typescript-eslint": pluginTypescript,
            "@sap-ux/eslint-plugin-fiori-tools": fioriToolsPlugin
        },
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"]
        }
    }
];
