import tsParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";

export default [
    {
        ignores: ["**/dist", "**/build", "**/docs", "**/*.md"],
    },
    {
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2018,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": typescriptEslintPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...typescriptEslintPlugin.configs["eslint-recommended"].rules,
            ...typescriptEslintPlugin.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-undef": "off",
            "eqeqeq": "error",
            "no-console": "warn",
            "no-debugger": "error",
            "curly": ["error", "all"],
            "no-var": "error",
            "prefer-const": "error",
            "no-multiple-empty-lines": ["error", {"max": 1}],
            "quotes": ["error", "double"],
        },
    },
];