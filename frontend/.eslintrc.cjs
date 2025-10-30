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
    "react/react-in-jsx-scope": "off", // Disable React import requirement for JSX (CRA handles it)
    // Temporarily disable PropTypes rule until deciding to use PropTypes or TypeScript
    "react/prop-types": "off"
  },

  // Enable Jest environment for test files to fix "no-undef" errors
  overrides: [
    {
      files: ["src/tests/**/*.{js,jsx}"],
      env: { jest: true }
    }
  ]
};

