module.exports = {
  displayName: "unit",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/test/unit/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
