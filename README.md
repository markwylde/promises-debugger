# Promises Debugger

A tool to give meaningful stacktraces for unhandled promise rejections

## Usage
Install the dependency
```
npm i promises-debugger
```

Require it in your main javascript file

```javascript
require('promises-debugger')({
  dimNodeModules: true,
  dimInternalModules: false,
  dimNotInProjectRoot: true,
  removeInternalModules: true
})
```

## Without promises-debugger
```bash
(node:9226) UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED 127.0.0.1:443
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1126:14)
(node:9226) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
(node:9226) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

## With promises-debugger
```bash
-------------------------------------------------
 promises-debugger caught an unhandled rejection
-------------------------------------------------
Error: connect ECONNREFUSED 127.0.0.1:443
    at Axios.request (/Users/mark/Documents/promises-debugger/node_modules/axios/lib/core/Axios.js:53:23)
    at Axios.<computed> [as post] (/Users/mark/Documents/promises-debugger/node_modules/axios/lib/core/Axios.js:78:17)
    at Function.wrap [as post] (/Users/mark/Documents/promises-debugger/node_modules/axios/lib/helpers/bind.js:9:15)
    at sayHello (/Users/mark/Documents/promises-debugger/test/index.js:15:15)
    at main (/Users/mark/Documents/promises-debugger/test/index.js:23:9)Error
    at main (/Users/mark/Documents/promises-debugger/test/index.js:21:9)
    at Object.<anonymous> (/Users/mark/Documents/promises-debugger/test/index.js:27:1)
-------------------------------------------
```
