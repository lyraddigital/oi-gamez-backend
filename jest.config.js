module.exports = {
  projects: [
    "<rootDir>/jest.integration.config.js",
    "<rootDir>/jest.unit.config.js",
  ],
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
