// frontend/.eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: true },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["react"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  settings: { react: { version: "detect" } },
  ignorePatterns: ["node_modules/", "build/", "dist/", ".next/", "out/"],

  rules: {
    "react/react-in-jsx-scope": "off",
    // 先临时关闭，等你们决定是否用 PropTypes 或 TS 再打开
    "react/prop-types": "off"
  },

  // 对测试文件启用 Jest 环境，修复 no-undef
  overrides: [
    {
      files: ["src/tests/**/*.{js,jsx}"],
      env: { jest: true }
      // 如仍有个别 no-undef，可再加：
      // , rules: { "no-undef": "off" }
    }
  ]
};




