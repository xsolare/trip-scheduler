export function throttle(delay: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args)

      if (import.meta.env?.VITE_APP_REQUEST_THROTTLE === true)
        await new Promise(resolve => setTimeout(resolve, delay))

      return result
    }

    return descriptor
  }
}
