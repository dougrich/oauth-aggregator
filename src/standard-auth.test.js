const { expect } = require('chai')
const StandardOauth2 = require('./standard-auth')

describe('standard-auth', () => {
  it('isValid returns true if it does not exist', () => {
    const oauth2 = new StandardOauth2('test', {}, {})
    expect(oauth2.isValid({})).to.equal(true)
  })

  it('isValid returns true if it exists and contains a client id and secret', () => {
    const oauth2 = new StandardOauth2('test', {}, {})
    expect(oauth2.isValid({
      test: {
        id: '1234',
        secret: 'cookies'
      }
    })).to.equal(true)
  })

  it('isValid throws an error if it exists and does not contain a client id and secret', () => {
    const oauth2 = new StandardOauth2('test', {}, {})
    expect(() => {
      oauth2.isValid({
        test: {
        }
      })
    }).to.throw()
  })
})