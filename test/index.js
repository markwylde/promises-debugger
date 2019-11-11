require('../promisesDebugger')({
  dimNodeModules: true,
  dimInternalModules: false,
  dimNotInProjectRoot: true,
  removeInternalModules: true
})

const axios = require('axios')

function wait (duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function sayHello () {
  await axios.post('https://localhost/nope')
  console.log('hello')
}

async function main () {
  console.log('started')
  await wait(500)
  
  await sayHello()
  console.log('ended')
}

main()
