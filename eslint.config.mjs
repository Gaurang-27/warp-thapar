import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules : {
      // Turn off unused-vars completely
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "prefer-const": "off",
      "react/no-unescaped-entities": "off", // also turn off base JS rule just in case
    },
  }
];

export default eslintConfig;
