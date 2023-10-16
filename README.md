# 使用说明
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

// 代码片段
<template>
    <div class="my-process-designer">
      <div class="my-process-designer__container">
        <div class="my-process-status">
          <span class="intro">状态：</span>
          <div class="finish">已完成</div>
          <div class="processing">流程中</div>
          <div class="todo">未进行</div>
        </div>
        <div class="my-process-designer__canvas" ref="bpmn-canvas" v-bind:style="{width: 100 * scale + '%',height: 100 * scale + '%'}"></div>
        <div class="session-info" v-show="selection">
          <div class="title-container">
            <img src="@/assets/images/Union.svg" class="avatra-ic" />
            <span>{{ selection.activityName }}</span>
          </div>
          <div class="approval-container">
            <div class="extra">处理人：</div>
            <div class="people-info">
              <img src="@/assets/images/logo1.svg" class="avatra">
              <div>
                <!-- <div> -->
                  <span class="name">{{ selection.createBy }}</span>
                  <!-- <span class="num">({{selection.No}})</span> -->
                <!-- </div> -->
                <!-- <div><span class="title">{{ selection.title}}</span></div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="my-process-handler">
          <img class="process-hander-ic" src="@/assets/images/boost.svg"  @click="handleZoom(0.1)" />
          <img class="process-hander-ic" src="@/assets/images/reduce.svg"  @click="handleZoom(-0.1)" />
        </div>
      </div>
    </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
 
import kuailuModdleDescriptor from '../../plugin/descriptor/kuailuDescriptor.json'
export default {
  name: 'flow',
  props: {
    processID: {
      type: String,
      default: ''
    },
    approveRecs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    processID (val) {
      if (!val) return
      this.processDefDetail()
    }
  },
  mounted () {
    this.initBpmnModeler()
  },
  data () {
    return {
      bpmnModeler: '',
      prefix: 'kuailu',
      selection: '',
      approvalPeople: [],
      scale: 1
    }
  },
  computed: {
    additionalModules () {
      return [{
        paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
        labelEditingProvider: ['value', ''], // 禁用节点编辑
        contextPadProvider: ['value', ''], // 禁用图形菜单
        bendpoints: ['value', {}], // 禁用连线拖动
        move: ['value', ''] // 禁用单个图形拖动
      }]
    }
  },
  methods: {
    initBpmnModeler () {
      if (this.bpmnModeler) return
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs['bpmn-canvas'],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions
      })
    },
    subscribeBpmnEvent () {
      let that = this
      that.bpmnModeler.on('selection.changed', ({ newSelection }) => {
        const id = newSelection[0] && newSelection[0].id
        const list = that.approveRecs.filter(item => item.taskDefinitionKey === id)
        if (list.length) {
          that.selection = list[0]
        } else {
          that.selection = ''
        }
      })
      const eventBus = this.bpmnModeler.get('eventBus')
      // 注册节点事件，eventTypes中可以写多个事件
      const eventTypes = ['element.click', 'element.hover']
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          const {element} = e
          if (!element.parent) return
          if (!e || element.type === 'bpmn:Process') {
            return false
          } else {
            if (eventType === 'element.hover') {
              // debugger
              // 鼠标滑过节点后想要做的处理
              console.log('鼠标经过节点啦~')
              const id = element.id
              const list = that.approveRecs.filter(item => item.taskDefinitionKey === id)
              if (list.length) {
                that.selection = list[0]
              } else {
                that.selection = ''
              }
            }
          }
        })
      })
    },
    // 获取流程图中所有节点信息
    getNodeInfoList () {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      const userTaskList = elementRegistry.filter(
        (item) => item.type === 'bpmn:UserTask'
      )
      const modeling = this.bpmnModeler.get('modeling')
      userTaskList.forEach(v => {
        // 更改节点名称
        modeling.updateLabel(v, '具体的处理人，不是节点名称')
      })
    },
 
    moddleExtensions () {
      const Extensions = {}
      if (this.prefix === 'kuailu') {
        Extensions.kuailu = kuailuModdleDescriptor
      }
      return Extensions
    },
    // 详情
    processDefDetail () {
      const that = this
      this.$apiRequest.processDefDetail(this.processID).then(async (res = {}) => {
        const {bpmnSnapshotBack, id, processDefNo, processDefName} = res.data || {}
        let xmlStr = bpmnSnapshotBack // 新取值
        that.fileDate = res.data
        that.processIdFromDetail = id // 流程id
        that.processNoFromDetail = processDefNo // 流程编码
        that.processNameFromDetail = processDefName // 流程名称
        if (that.processIdFromDetail && that.processIdFromDetail.indexOf('Process_') === -1) {
          that.processIdFromDetail = 'Process_' + that.processIdFromDetail
        }
        if (that.processNameFromDetail && that.processNameFromDetail.indexOf('Name_') === -1) {
          that.processNameFromDetail = 'Name_' + that.processNameFromDetail
        }
        await that.createNewDiagram(xmlStr)
        this.setCurrentSept()
        this.getNodeInfoList()
      })
    },
    /* 创建新的流程图 */
    async createNewDiagram (xml) {
      let that = this
      // 将字符串转换成图显示出来
      let newId = that.processIdFromDetail || `Process_${new Date().getTime()}`
      let newNo = that.processNoFromDetail || `No_${new Date().getTime()}`
      let newName = that.processNameFromDetail || `Name_${new Date().getTime()}`
      let xmlString = xml || this.getDefaultEmptyXML(newId, newNo, newName, that.prefix)
      try {
        let { warnings } = await that.bpmnModeler.importXML(xmlString)
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn))
        }
        if (document.getElementsByClassName('bjs-powered-by').length) {
          document.getElementsByClassName('bjs-powered-by')[0].style.display = 'none'
        }
        this.subscribeBpmnEvent()
      } catch (e) {
        console.error(`[Process Designer Warn]:`)
      }
    },
    setCurrentSept () {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      const nodeList = elementRegistry.filter(
        (item) => {
          return ['bpmn:UserTask', 'bpmn:ServiceTask'].includes(item.type)
        }
      )
      let modeling = this.bpmnModeler.get('modeling')
      const completedNode = this.approveRecs.filter(_ => _.status === 'completed').map(_ => _.taskDefinitionKey)
      const activeNode = this.approveRecs.filter(_ => _.status === 'active').map(_ => _.taskDefinitionKey)
      nodeList.forEach((item, index) => {
        if (completedNode.includes(item.id)) {
          modeling.setColor(nodeList[index], {
            fill: '#E8FFEA'
          })
        } else if (activeNode.includes(item.id)) {
          modeling.setColor(nodeList[index], {
            fill: '#BFDBFD'
          })
        } else {
          modeling.setColor(nodeList[index], {
            fill: '#ECEDEE'
          })
        }
      })
    },
    getDefaultEmptyXML (key, no, name, type) {
      if (!type) type = 'kuailu'
      const TYPE_TARGET = {
        activiti: 'http://activiti.org/bpmn',
        camunda: 'http://bpmn.io/schema/bpmn',
        kuailu: 'http://www.kuailu.com/1.0/bpmn'
      }
      return `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn2:definitions
          xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
          exporter="Camunda Modeler"
          exporterVersion="1.10.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
          xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
          xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
          xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
          xmlns:kuailu="http://www.kuailu.com/1.0/bpmn"
          xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
          id="diagram_${key}"
          targetNamespace="${TYPE_TARGET[type]}">
 
          <bpmn2:process id="${key}" no="${no}" name="${name}" isExecutable="true">
          </bpmn2:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn2:definitions>`
    },
    handleZoom (flag) {
      this.scale += flag
      this.$nextTick(() => {
        this.bpmnModeler.get('canvas').zoom(this.scale)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.my-process-designer {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  margin-top: 20px;
  .my-process-designer__container {
    display: inline-flex;
    width: 100%;
    flex: 1;
    .my-process-designer__canvas {
      flex: 1;
      height: 100%;
      position: relative;
      background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+")
      repeat !important;
      div.toggle-mode {
        display: none;
      }
    }
    .my-process-status {
      position: absolute;
      display: flex;
      top: 20px;
      left: 20px;
      font-size: 12px;
      .intro {
        color: #999999;
        margin-top: 3px;
      }
      .finish {
        background-color: #E8FFEA;
        padding: 4px;
        border: 1px solid rgba(0, 180, 42, 0.1);
        border-radius: 3px;
        color: #00B42A;
        margin-right: 8px;
      }
      .processing {
        background-color: #E8F3FE;
        padding: 4px;
        border: 1px solid #BFDBFD;
        border-radius: 3px;
        color: #165DFF;
        margin-right: 8px;
      }
      .todo {
        padding: 4px;
        background: #ECEDEE;
        border: 1px solid rgba(204, 204, 204, 0.1);
        border-radius: 3px;
        color: #666666;
        margin-right: 5px;
      }
    }
    svg {
      width: 100%;
      height: 100%;
      min-height: 100%;
      overflow: hidden;
    }
    .session-info {
      position: absolute;
      width: 200px;
      height: 300px;
      background: #FFFFFF;
      border: 1px solid #ECEDF2;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      right: 20px;
      top: 10px;
      .title-container {
        padding: 18px;
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #333333;
        font-weight: 500;
        height: 50px;
        border-bottom: 1px solid #ECEDF2;
        .avatra-ic {
          margin-right: 5px;
          width: 15px;
          height: 15px;
          margin-top: 2px;
        }
      }
      .approval-container {
        padding: 12px 16px;
        .extra {
          font-size: 12px;
          color: #333333;
          margin-bottom: 10px;
        }
        .avatra {
          width: 32px;
          height: 32px;
          border-radius: 32px;
          margin-right: 10px;
        }
        .people-info {
          display: flex;
          font-size: 12px;
          margin-bottom: 10px;
          align-items: center;
        }
        .name {
          color: #333333;
        }
        .num {
          color: #999999;
        }
        .title {
          color: #999999;
        }
      }
    }
    .my-process-handler {
      display: flex;
      bottom: 50px;
      position: absolute;
      right: 20px;
      width: 92px;
      height: 42px;
      border-radius: 30px;
      align-items: center;
      background-color: #525252;
      .process-hander-ic {
        flex: 1;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
  }
}
 
</style>