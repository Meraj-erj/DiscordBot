import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    {
        ignores: ["dist/**", "node_modules/**", "logs/**", "print-source.js"],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    eslintConfigPrettier,

    {
        files: ["src/**/*.ts"],

        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        rules: {
            "no-console": "off",

            "@typescript-eslint/no-explicit-any": "warn",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
        },
    },
];
