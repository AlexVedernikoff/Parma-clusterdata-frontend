module.exports = {
    setupFilesAfterEnv: [
        '@testing-library/jest-dom'
    ],
    testMatch: [
        '**/?(*.)test.ts?(x)'
    ],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
            diagnostics: false,
        },
    },
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/jest/styleMock.js",
        "\\.(gif|ttf|eot|svg)$": "<rootDir>/jest/fileMock.js"
    },
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ]
}