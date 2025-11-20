import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Regras globais personalizadas
  {
    rules: {
      // Permitir uso explícito de 'any'
      "@typescript-eslint/no-explicit-any": "off",

      // Ajustar regra de variáveis não utilizadas
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all", // Verifica todas as variáveis
          args: "after-used", // Só alerta para argumentos não usados no fim
          ignoreRestSiblings: true, // Ignora variáveis omitidas via rest destructuring
          varsIgnorePattern: "^_", // Ignora variáveis iniciadas com "_"
          argsIgnorePattern: "^_", // Ignora argumentos iniciados com "_"
        },
      ],
    },
  },
];

export default eslintConfig;
