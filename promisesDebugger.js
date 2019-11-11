const path = require('path')
let appDir = path.dirname(require.main.filename)
appDir = appDir.split('/node_modules/')[0]

function colorYellow (text) {
  if (!text) {
    return ''
  }
  return `\x1b[33m${text}\x1b[0m`
}

function colorGray (text) {
  if (!text) {
    return ''
  }
  return `\x1b[90m${text}\x1b[0m`
}

function filterOutUnwanted (tests, line) {
  return tests
    .filter(
      test => line.includes(test)
    )
    .length > 0
}

function promisesDebugger (options={}) {
  const asyncHooks = require('async_hooks')
  const stackTraces = new Map()

  function init (asyncId) {
    let capturedStackTrace = {}
    Error.captureStackTrace(capturedStackTrace)
    stackTraces.set(asyncId, capturedStackTrace.stack)
  }

  function destroy (asyncId) {
    stackTraces.delete(asyncId)
  }

  const asyncHook = asyncHooks.createHook({
    init,
    destroy
  })

  asyncHook.enable()

  const tests = {
    toDim: [
    ],

    toRemove: [
      'promisesDebugger.js',
      'internal/async_hooks.js',
      'at Promise.then (<anonymous>)',
      'internal/modules/cjs/loader.js'
    ]
  }

  if (options.dimNodeModules) {
    tests.toDim.push('/node_modules')
  }

  if (options.dimInternalModules) {
    tests.toDim = tests.toDim.concat([
      '(https.js'
    ])
  }

  if (options.removeInternalModules) {
    tests.toRemove = tests.toRemove.concat([
      ' (https.js:',
      ' (_tls_wrap.js:',
      ' (net.js:',
      '    at net.js:',
      ' (dns.js'
    ])
  }

  global.Error = class extends Error {
    constructor(message) {
      super(message)
      this.constructor.captureStackTrace(this, this.constructor)
    }

    static captureStackTrace(what, where) {
      super.captureStackTrace.call(Error, what, where)
      let trace = stackTraces.get(asyncHooks.executionAsyncId())
      if (trace) {
        what.promiseStack = (what.promiseStack || '') + trace + '\n'
      }
    }
  }

  process.on('unhandledRejection', error => {
    console.log('-------------------------------------------------')
    console.log(' promises-debugger caught an unhandled rejection')
    console.log('-------------------------------------------------')

    let trace = error.promiseStack

    if (!options.disableClean) {
      trace = trace
        .split('\n')
        .filter(line => {
          return !filterOutUnwanted(tests.toRemove, line)
        })
        .map(line => {
          if (filterOutUnwanted(tests.toDim, line)) {
            return colorGray(line)
          }

          if (options.dimNotInProjectRoot) {
            if (!line.includes(appDir) && !line.startsWith('Error: ')) {
              return colorGray(line)
            }
          }

          if (line.includes(appDir)) {
            const splitLine = line.trim().split(' ')
            splitLine[1] = colorYellow(splitLine[1])

            splitLine[2] = splitLine[2].replace(appDir, colorGray(appDir))

            return '    ' + splitLine.join(' ')
          }

          return line
        })
        .filter(i => !!i)
        .join('\n')
      }
    console.log(trace)

    process.exit(1)

    console.log('-------------------------------------------')
  });


}

module.exports = promisesDebugger
