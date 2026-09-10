module.exports = function (config) {
  config.set({ frameworks: ['jasmine'], customLaunchers: {
    ChromeHeadlessHero: { base: 'ChromeHeadless', flags: ['--window-size=1600,1000', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'] }
  } });
};
