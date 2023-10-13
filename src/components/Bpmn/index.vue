<template>
<Total :bpmnModeler="state.bpmnModeler" :canvasBpmn="canvasBpmn">
  <el-button type='info'>
    导入流程
    <input type="file" @change="importXml"/>
  </el-button>
  <el-button type='info' @click="saveX">
    测试保存去空

  </el-button>
</Total>
  <div class="content">
    <!--    画布区域-->
    <div class="canvas" ref="canvasBpmn" id="canvasBpmn"></div>
    <!--    侧边栏区域-->
    <div class="properties" ref="properties"></div>
    <Drawer ref="drawer" :drawerView="drawerView" :taskId="state.taskId"
            @closeDrawer="closeDrawer"
    />
  </div>
</template>
<script setup>
import {ref, reactive, onMounted} from 'vue'
// 引入bpmn
import BpmnModeler from 'bpmn-js/lib/Modeler'
//引入bpmn侧边栏
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
// 引入头部组件
import Total from './components/Total.vue'
// 引入底部抽屉
import Drawer from "./components/Drawer.vue";
//初始数据
import {xmlStr} from './mock/xmlStr.js'
import {readOnlyJs} from './mock/readOnly.js'
import {editCreateJs} from './mock/editCreate.js'
// 引入pinia
import taskData from './store/taskData.js'
const taskDateStore = taskData()
const canvasBpmn = ref()
const properties = ref()
const drawer = ref()
//数据drawer
const drawerView = ref(false)
// 只读模式
const onRead = ref(false)
const state = reactive({
  //bpmn建模
  bpmnModeler: null,
  container: null,
  //选中的任务ID
  taskId:''
})

const createNewDiagram = (data) => {
  let strValue = xmlStr
  if (data) {
    strValue = data
  }
  try {
   state.bpmnModeler.importXML(strValue)
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
    propertiesPanel: {
      parent: proper
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      onRead.value ? '' : BpmnPropertiesProviderModule,
      onRead.value ? {...readOnlyJs} :
        {...editCreateJs},
    ]
  })
  createNewDiagram()
  const eventBus = state.bpmnModeler.get('eventBus');
// 注册节点事件，eventTypes中可以写多个事件
  const eventTypes = ['element.click'];
  eventTypes.forEach((eventType) => {
    eventBus.on(eventType, (e) => {
      const {element} = e;
      if (!element.parent) return;
      if (!e || element.type === 'bpmn:Process') {
        return false;
      } else {
        if (eventType === 'element.click') {
          // const elementRegistry = state.bpmnModeler.get('elementRegistry');
          // const userTaskList = elementRegistry.filter(
          //   (item) => item.type === 'bpmn:UserTask'
          // );
          // console.log('userTaskList',userTaskList)
          if (element.type === "bpmn:UserTask") {
            state.taskId = element.id
            drawerView.value = false
            drawerView.value = true
          }
        }
      }
    });
  });
}
const importXml = (e) => {
  console.log(e.target.files[0])
  const newFile = e.target.files[0]
  const reader = new FileReader()
  reader.readAsText(newFile, "UTF-8")
  reader.onload = () => {
    createNewDiagram(reader.result)
  }
  return false
}
// 销毁bpmn
const destroyBpmn = () => {
  state.bpmnModeler.destroy()

}
//销毁drawer
const closeDrawer = ()=>{
  drawerView.value = false
  // drawer.value.reset()
}
// 测试去空
const saveX = ()=>{
  taskDateStore.updataElement()
  console.log('taskDateStore',taskDateStore.taskData)
}
onMounted(() => {
  init()
})
</script>
<style lang='scss' scoped>
.content {
  position: absolute;
  width: 100%;
  height: calc(100% - 50px);
  top: 50px;
  left: 0;

  .canvas {
    width: 100%;
    height: 100%;
  }

  .properties {
    position: absolute;
    right: 0;
    top: 20px;
    padding: 10px;
    background-color: #eeeeee;
  }


}


.drawerClass {
  .headerClass {
    font-weight: 700;
  }

}
</style>
