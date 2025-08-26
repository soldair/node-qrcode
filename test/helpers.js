const nativePromise = global.Promise
export const removeNativePromise = function () {
  if (global.Promise) {
    delete global.Promise
  }
}
export const restoreNativePromise = function () {
  if (!global.Promise) {
    global.Promise = nativePromise
  }
}
