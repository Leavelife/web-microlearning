/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  // Transformasi file JS/JSX dengan babel-jest (mendukung ESM import/export)
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  // Alias @/ → root proyek
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Test hanya dari folder __tests__
  testMatch: ["**/__tests__/**/*.test.js"],
};

module.exports = config;
