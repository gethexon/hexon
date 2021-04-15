function error (message) {
  const err = new Error(message)
  err.name = 'DI'
  throw err
}
const stack = []
class DI {
  static provide (descriptor, ctor) {
    if (DI.ctors.has(descriptor)) error(`descriptor ${descriptor} in use`)
    DI.ctors.set(descriptor, ctor)
    DI.logger.debug('provide', descriptor)
  }

  static inject (descriptor) {
    if (!descriptor) error('descriptor is required')
    if (!DI.ctors.has(descriptor)) error(`descriptor ${descriptor} not found`)
    if (stack.includes(descriptor)) { error('circular dependences: ' + stack.concat(descriptor).join(' > ')) }
    DI.logger.debug('inject', descriptor)
    stack.push(descriptor)
    let service
    service = DI.services.get(descriptor)
    if (!service) {
      DI.logger.debug('instantiate', descriptor)
      service = new (DI.ctors.get(descriptor))()
      DI.services.set(descriptor, service)
    }
    stack.pop(descriptor)
    return service
  }

  static from (ctors, services) {
    if (!ctors || !services)error('invalid init options')
    DI.ctors = ctors
    DI.services = services
  }

  static setLogger (logger) {
    DI.logger = logger
  }
}
DI.ctors = new Map()
DI.services = new Map()
module.exports = DI
