import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// // bpmn整体样式
// import 'bpmn-js/dist/assets/diagram-js.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// // bpmn右边工具栏样式
// import '@bpmn-io/properties-panel/dist/assets/properties-panel.css'
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';
const pinia = createPinia();
const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')

