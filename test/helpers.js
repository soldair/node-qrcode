var nativePromise = global.Promise

exports.removeNativePromise = function () {
  if (global.Promise) {
    delete global.Promise
  }
}

exports.restoreNativePromise = function () {
  if (!global.Promise) {
    global.Promise = nativePromise
  }
}
