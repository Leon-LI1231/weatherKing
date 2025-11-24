// frontend/.eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: true }, //tells the environment
  parserOptions: {
    ecmaVersion: "latest", //tell ESLint to support the lastest javascript
    sourceType: "module", // so that "import React from "react" "works
    ecmaFeatures: { jsx: true },
  },
  plugins: ["react"],
  extends: [
    "eslint:recommended", //eslint:recommended — enables ESLint’s official recommended rules (e.g., no unused vars, syntax errors)
    "plugin:react/recommended", // 2. plugin:react/recommended — applies React best-practice rules for components and JSX
    "prettier", // 3. prettier — disables ESLint rules that conflict with Prettier’s formatting to avoid duplicate warnings
  ],
  settings: { react: { version: "detect" } },
  ignorePatterns: ["node_modules/", "build/", "dist/", ".next/", "out/"],

  rules: {
    // Disable the rule requiring "import React" in JSX files,
    "react/react-in-jsx-scope": "off", // Disable React import requirement for JSX (CRA handles it)， In React 17+ with the new JSX Transform (via Babel), importing React is no longer necessary.
    // Temporarily disable PropTypes rule until deciding to use PropTypes or TypeScript
    "react/prop-types": "off",
  },

  // Enable Jest environment for test files to fix "no-undef" errors，This prevents ESLint from flagging Jest globals (e.g., describe, test, expect) as undefined.
  overrides: [
    {
      files: [
        "src/tests/**/*.{js,jsx}",
        "src/**/*.test.{js,jsx}",
        "src/**/*.spec.{js,jsx}",
        "src/setupTests.js",
      ],
      env: { jest: true },
    },
  ],
};
