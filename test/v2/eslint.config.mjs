import pluginTypescript from "@typescript-eslint/eslint-plugin";
import parserTypescript from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended
});

export default [
    ...compat.extends("plugin:@sap-ux/eslint-plugin-fiori-tools/defaultTS"),
    {
        ignores: ["dist/**"],
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
            "@typescript-eslint": pluginTypescript
        },
        rules: {
            "@typescript-eslint/no-floating-promises": "off",
            "linebreak-style": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: ["variableLike", "memberLike", "method"],
                    format: ["camelCase"],
                    leadingUnderscore: "forbid",
                    trailingUnderscore: "forbid"
                },
                {
                    selector: "interface",
                    format: ["PascalCase"]
                },
                {
                    selector: "property",
                    modifiers: ["public"],
                    format: ["camelCase"]
                },
                {
                    selector: "class",
                    format: ["PascalCase"]
                }
            ],
            "semi": ["error", "always"],
            "quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
            "@typescript-eslint/member-ordering": ["error", {
                default: [
                    "public-static-field",
                    "public-instance-field",
                    "protected-static-field",
                    "protected-instance-field",
                    "private-static-field",
                    "private-instance-field",
                    "constructor",
                    "public-static-method",
                    "public-instance-method",
                    "protected-static-method",
                    "protected-instance-method",
                    "private-static-method",
                    "private-instance-method"
                ]
            }],
            "no-var": "error",
            "@typescript-eslint/max-params": ["error", { max: 3 }],
            "max-len": ["error", {
                code: 150,
                ignoreUrls: true,
                ignoreStrings: false,
                ignoreTemplateLiterals: false,
                ignoreComments: false
            }]
        }
    }
];
