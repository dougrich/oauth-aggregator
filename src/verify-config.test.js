const { expect } = require('chai')

const verifyConfiguration = require('./verify-config')

describe('verify-config', () => {
  it('returns true if plugins are valid, have no warnings', () => {
    const plugin = {
      name: 'test',
      isValid: (config, logger) => true
    }
    const {
      isValid,
      errors,
      warnings
    } = verifyConfiguration([plugin], {})
    expect(isValid).to.deep.equal(true)
    expect(errors).to.deep.equal([])
    expect(warnings).to.deep.equal([])
  })

  it('returns false if plugins are invalid', () => {
    const exampleError = new Error('Invalid configuration')
    const plugin = {
      name: 'test',
      isValid: (config, logger) => { throw exampleError }
    }
    const {
      isValid,
      errors,
      warnings
    } = verifyConfiguration([plugin], {})
    expect(isValid).to.deep.equal(false)
    expect(errors).to.deep.equal([
      {
        plugin: 'test',
        error: exampleError
      }
    ])
    expect(warnings).to.deep.equal([])
  })

  it('returns true if plugins are valid but have warnings', () => {
    const plugin = {
      name: 'test',
      isValid: (config, logger) => {
        logger.warn('Potential issue')
        return true
      }
    }
    const {
      isValid,
      errors,
      warnings
    } = verifyConfiguration([plugin], {})
    expect(isValid).to.deep.equal(true)
    expect(errors).to.deep.equal([])
    expect(warnings).to.deep.equal([
      {
        plugin: 'test',
        message: 'Potential issue'
      }
    ])
  })
})