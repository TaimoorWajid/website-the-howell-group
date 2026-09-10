module.exports = function (config) {
  config.set({ frameworks: ['jasmine'], customLaunchers: { ChromeHeadlessDesktop: { base: 'ChromeHeadless', flags: ['--window-size=1440,900'] } } });
};

