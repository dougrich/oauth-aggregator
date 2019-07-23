function staticRender(render) {
  let rendered = null
  return function (req, res) {
    if (!rendered) rendered = render()
    res.status(200)
    res.end(rendered)
  }
}

module.exports = staticRender