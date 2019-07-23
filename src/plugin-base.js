class PluginBase {
  constructor(name) {
    this.name = name
  }

  isValid() {
    return true
  }

  bootstrap() {
    // do nothing
  }
}

module.exports = PluginBase