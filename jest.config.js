module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}; 