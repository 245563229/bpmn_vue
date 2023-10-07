import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// bpmn整体样式
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// bpmn右边工具栏样式
// import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
createApp(App).mount('#app')
