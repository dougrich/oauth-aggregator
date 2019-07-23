function verifyConfiguration(plugins, config) {
  // for each plugin
  // - check to see if it is applicable
  // - if it is applicable, run the plugin's validate function
  // - collect errors and warnings
  // - return errors and warnings
  let isValid = true
  let errors = []
  let warnings = []
  let current = null

  const logger = {
    warn: message => {
      warnings.push({
        plugin: current,
        message 
      })
    }
  }

  for (const p of plugins) {
    current = p.name
    try {
      p.isValid(config, logger)
    } catch (error) {
      isValid = false
      errors.push({
        plugin: current,
        error
      })
    }
  }

  return {
    isValid,
    errors,
    warnings
  }
}

module.exports = verifyConfiguration