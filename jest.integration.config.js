module.exports = {
  displayName: "integration",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/test/integration/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["./test/integration/setup.ts"],
};
