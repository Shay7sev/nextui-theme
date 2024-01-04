module.exports = {
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  rules: {
    // "no-console": "error",
    // 'prettier/prettier': 'warn',
    "no-var": "error", // 要求使用 let 或 const 而不是 var
    eqeqeq: [2, "allow-null"], // 使用 === 替代 ==
    "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
    "no-multi-spaces": 2, // 不能用多余的空格
    "no-trailing-spaces": 2, // 一行结束后面不要有空格
    "no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
    "prefer-const": "off", // 此规则旨在标记使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    "no-irregular-whitespace": "off", // 禁止不规则的空白
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "react-hooks/rules-of-hooks": "error", // 检查 Hooks 的声明
    "react-hooks/exhaustive-deps": "warn", // 检查依赖项的声明
    "react/display-name": "off",
    "import/no-anonymous-default-export": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ], // 禁止定义未使用的变量
  },
};
