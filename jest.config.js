export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: ['**/backend/tests/**/*.test.js'],
    collectCoverageFrom: [
        'backend/**/*.js',
        '!backend/tests/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true
};