module.exports = {
  //仅在必需时为对象的key添加引号
  quoteProps: "as-needed",
  // jsx中使用单引号
  jsxSingleQuote: false,
  //多属性html标签的‘>’折行放置
  jsxBracketSameLine: true,
  bracketSameLine: true,
  //单参数箭头函数参数周围使用圆括号-eg: (x) => x
  arrowParens: "always",
  //对HTML全局空白不敏感
  htmlWhitespaceSensitivity: "ignore",
  endOfLine: "lf",
  // 一行的字符数，如果超过会进行换行，默认为80
  printWidth: 80,
  // 一个tab代表几个空格数，默认为2
  tabWidth: 2,
  // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
  useTabs: false,
  // 字符串是否使用单引号，默认为false，使用双引号
  singleQuote: false,
  // 行位是否使用分号，默认为true
  semi: true,
  // 在 HTML、Vue 和 JSX 中每行强制执行单个属性
  singleAttributePerLine: false,
  // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  trailingComma: "es5",
  // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  bracketSpacing: true,
  // plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  // importOrder: [
  //   "^vite",
  //   "^react",
  //   "^antd",
  //   "<THIRD_PARTY_MODULES>",
  //   "components/",
  //   "pages/",
  //   "hooks/",
  //   "utils/",
  //   "^[./]",
  // ],
  // importOrderSortSpecifiers: true,
  // importOrderGroupNamespaceSpecifiers: true,
  // importOrderCaseInsensitive: true,
};
