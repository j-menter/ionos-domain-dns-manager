import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    ignores: [
      "**/*.min.js",
      "public/cropper/cropper.js",
      "public/cropper/fa-v5.15.4-all.css",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  stylistic.configs.customize({
    // the following options are the default values
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
  }),
  {
    rules: {
      "@stylistic/brace-style": ["error", "1tbs"],
    },
  },
];
