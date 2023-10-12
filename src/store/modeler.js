import { defineStore } from 'pinia'
const defaultState = {
  activeElement: undefined,
  activeElementId: undefined,
  modeler: null,
  moddle: null,
  modeling: null,
  canvas: null,
  elementRegistry: null
}

export default defineStore('modeler', {
  state: () => defaultState,
  getters: {
    getActive: (state) => state.activeElement,
    getActiveId: (state) => state.activeElementId,
    getModeler: (state) => state.modeler,
    getModdle: (state) => state.moddle,
    getModeling: (state) => state.modeling,
    getCanvas: (state) => state.canvas,
    getElRegistry: (state) => state.elementRegistry
  },
  actions: {
    setModeler(modeler) {
      this.modeler = modeler
    },
    setModules(key, module) {
      this[key] = module
    },
    setElement(element, id) {
      this.activeElement = element
      this.activeElementId = id
    }
  }
})
