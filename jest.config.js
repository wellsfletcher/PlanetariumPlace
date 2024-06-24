/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = { // might need to make sure test cases are omitted from the compiled build
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: "./",
  // coverageDirectory: "./app",
  collectCoverageFrom: [
      "./app/**/*.ts",
      // "./app/**/*.js",
      // "!./app/**/*.js"
  ],
  testPathIgnorePatterns: [
      "./node_modules",
      // "./dist"
  ],
  coverageReporters: ["json", "html"],
  // preset: 'ts-jest', // Uses ts-jest preset for handling TypeScript files
  // testEnvironment: 'node', // Sets the environment in which tests will run
  // globals: { // Global settings for the ts-jest compiler
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.json', // Path to the TypeScript configuration file
  //   },
  // },
  moduleFileExtensions: ['ts', 'tsx', 'js'], // File extensions Jest will recognize
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transforms TypeScript files using ts-jest
  },
  // testMatch: ["./app/**/*.test.ts"] // Patterns Jest uses to find test files
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"]
};