module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  verbose: true,

  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.(ts|tsx)$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json', 'vue', 'ts'],
}
