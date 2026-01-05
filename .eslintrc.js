module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-mixed-spaces-and-tabs": 0,//禁止混用tab和空格
    'no-unused-vars': 0,//不能有声明后未被使用的变量或参数
    'no-case-declarations': 0,//禁止在case 中使用let const等
    "prefer-const": "off",
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars':'off',
    "@typescript-eslint/no-explicit-any": 'off',
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-this-alias": ["off"]
  }
}
