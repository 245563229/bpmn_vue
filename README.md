# 使用准备
必须项，在高版本bpmn中（当前14.0）右侧属性栏需求文件已经和低版本不同
yarn add @bpmn-io/properties-panel
必须项，bpmn核心组件
"bpmn-js": "^14.0.0",
bpmn右侧属性栏
"bpmn-js-properties-panel": "^5.5.0",
bpmn交互XML
"bpmn-moddle": "^8.0.1",
基于bpmn.io的外部历程设计器
"camunda-bpmn-moddle": "^7.0.1",
小地图
"diagram-js-minimap": "^4.1.0",
## 必要的文件
src/assets/zh.js
src/assets/translations.js
src/mock/xmlStr.js
## 引入必须项
main.js中
// bpmn整体样式
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// bpmn右边工具栏样式
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css'
## vue中使用

[//]: # (<body>)
<!--    画布区域-->
    <div class="canvas" ref="canvasBpmn" id="canvasBpmn"></div>
<!--    侧边栏区域-->
    <div class="properties" ref="properties"></div>

[//]: # (<script>)
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
//模拟数据
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