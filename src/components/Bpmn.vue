<template>
  <div class="content">
    <div class="canvas" ref="canvasBpmn" id="canvasBpmn"></div>
  </div>
</template>
<script setup>
import {ref, reactive, onMounted} from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import {xmlStr} from '../mock/xmlStr'
const canvasBpmn = ref()
const state = reactive({
  //bpmn建模
  bpmnModeler: null,
  container: null,
})
const createNewDiagram = () => {
  try {
    state.bpmnModeler.importXML(xmlStr)
  } catch (err) {
    console.log(err.message, err.warnings)
  }
}
const init = () => {
  const canvas = canvasBpmn.value
  state.bpmnModeler = new BpmnModeler({
    container: canvas
  })
  createNewDiagram()
}
onMounted(() => {
  init()
})
</script>
<style lang='scss' scoped>
.content {

  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
