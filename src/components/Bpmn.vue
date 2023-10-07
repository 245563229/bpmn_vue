<template>
  <div class="content">
<!--    画布区域-->
    <div class="canvas" ref="canvasBpmn" id="canvasBpmn"></div>
<!--    侧边栏区域-->
    <div class="properties" ref="properties"></div>
  </div>
</template>
<script setup>
import {ref, reactive, onMounted} from 'vue'
//bpmn汉化
import translate from '../assets/translations.js'
// 引入bpmn
import BpmnModeler from 'bpmn-js/lib/Modeler'
//引入bpmn侧边栏
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import {xmlStr} from '../mock/xmlStr'
const canvasBpmn = ref()
const properties = ref()
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
  const proper = properties.value
  state.bpmnModeler = new BpmnModeler({
    container: canvas,
    //控制板
    propertiesPanel:{
      parent:proper
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      { translate: ['value', translate] }
    ]

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
  .properties{
    position: absolute;
    right: 0;
    top: 20px;
    padding: 30px;
    background-color: #eeeeee;
  }
}
</style>
