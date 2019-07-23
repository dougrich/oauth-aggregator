const set = module.exports = {
  list: [],
  names: []
}

function add(name) {
  set.list.push(require('./' + name))
  set.names.push(name)
}

add('microsoft')
add('google')
add('reddit')