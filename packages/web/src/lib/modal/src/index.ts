import {
  App,
  Component,
  inject,
  InjectionKey,
  markRaw,
  provide,
  Ref,
  ref,
} from "vue"
import { v4 as uuid } from "uuid"
const key: InjectionKey<ModalController> = Symbol("modal-controller")

interface IModalItem {
  id: string
  component: Component
  close: () => void
}
export interface ModalController {
  modals: Ref<IModalItem[]>
  create(component: Component): IModalItem
  install(app: App): void
}
export function createModalPlugin(): ModalController {
  const modals = ref<IModalItem[]>([])
  function create(component: Component) {
    const id = uuid()
    const item = {
      id,
      component: markRaw(component),
      close: () => {
        modals.value = modals.value.filter((item) => item.id !== id)
      },
    }
    modals.value.push(item)
    return item
  }
  return {
    modals,
    create,
    install(app: App) {
      const controller = this
      app.provide(key, controller)
    },
  }
}

export function useModal() {
  return inject(key)!
}
