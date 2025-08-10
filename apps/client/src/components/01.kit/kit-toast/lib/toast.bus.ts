import type { IToastMessage } from '~/components/01.kit/kit-toast'

interface BusEvents {
  add: IToastMessage
  remove: IToastMessage
}

type EventName = keyof BusEvents

const bus = new Map<EventName, Set<(payload: any) => void>>()

function on<T extends EventName>(event: T, callback: (payload: BusEvents[T]) => void) {
  if (!bus.has(event)) {
    bus.set(event, new Set())
  }
  bus.get(event)!.add(callback)
}

function off<T extends EventName>(event: T, callback: (payload: BusEvents[T]) => void) {
  if (bus.has(event)) {
    bus.get(event)!.delete(callback)
  }
}

function emit<T extends EventName>(event: T, payload: BusEvents[T]) {
  if (bus.has(event)) {
    bus.get(event)!.forEach(callback => callback(payload))
  }
}

export const ToastBus = { on, off, emit }
