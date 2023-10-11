<template>
  <div class="nav">
    <a hidden ref="downloadLink"></a>
    <!--    <button @click="createNewDiagram">-->
    <!--      新建流程-->
    <!--    </button>-->
    <button>
      导入流程
      <input type="file" @change="importXml"/>
    </button>
    <button @click="exportXml">
      导出XML
    </button>
    <button @click="exportSvg">
      下载svg
    </button>
    <button @click="handelCancel">
      撤销
    </button>
    <button @click="handelReset">
      恢复
    </button>
    <button @click="handlerZoom(0.2)">
      放大
    </button>
    <button @click="handlerZoom(-0.2)">
      缩小
    </button>
    <!--    <button @click="viewXml">-->
    <!--      xml预览-->
    <!--    </button>-->
    <button @click="viewSvg">
      svg预览
    </button>
  </div>
  <div class="content">
    <!--    画布区域-->
    <div class="canvas" ref="canvasBpmn" id="canvasBpmn"></div>
    <!--    侧边栏区域-->
    <div class="properties" ref="properties"></div>
    <!--    <div v-if="showView" class="showViewClass" ref="shouViewDiv">-->
    <!--      <pre>{{ bpmnValue }}<code></code></pre>-->
    <!--    </div>-->
    <div v-if="showView" class="showViewClass" ref="shouViewDiv">
      <button class="closeView" @click="showView=false">关闭预览</button>
      <div style="text-align: center;" v-html="bpmnValue"></div>
    </div>
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
//模拟数据
import {xmlStr} from '../mock/xmlStr.js'

const downloadLink = ref()
const canvasBpmn = ref()
const properties = ref()
const shouViewDiv = ref()
//预览弹窗
const showView = ref(false)
// 只读模式
const onRead = ref(false)
//编辑器内容
const bpmnValue = ref()
const state = reactive({
  //bpmn建模
  bpmnModeler: null,
  container: null,
  //放大倍率
  scale: 1
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
      BpmnPropertiesProviderModule,
      {translate: ['value', translate]}
    ]

  })
  createNewDiagram()
}
//导入流程
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
//下载相关
const download = ({name = "diagram.bpmn", data}) => {
  // 这里就获取到了之前设置的隐藏链接
  const downloadLinks = downloadLink.value;
  // 把输就转换为URI，下载要用到的
  const encodedData = encodeURIComponent(data);
  if (data) {
    // 将数据给到链接
    downloadLinks.href =
      "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
    // 设置文件名
    downloadLinks.download = name;
    // 触发点击事件开始下载
    downloadLinks.click();
  }
}
// 导出xml
const exportXml = async () => {
  console.log('点击了导出')
  try {
    const {xml} = await state.bpmnModeler.saveXML({format: true});
    // 获取文件名
    const name = `工作流.bpmn`;
    // 将文件名以及数据交给下载方法
    download({name: name, data: xml});
  } catch (error) {
    console.error('下载Bpmn失败，请重试')
  }
}
// 导出svg

const exportSvg = async () => {
  console.log('点击导出svg')
  try {
    const {xml} = await state.bpmnModeler.saveXML({format: true});
    // 获取文件名
    const name = `流程图.svg`;
    // 从建模器画布中提取svg图形标签
    let context = "";
    const djsGroupAll = canvasBpmn.value.querySelectorAll(".djs-group");
    for (let item of djsGroupAll) {
      context += item.innerHTML;
    }
    // 获取svg的基本数据，长宽高
    const viewport = canvasBpmn.value
      .querySelector(".viewport")
      .getBBox();
    // 将标签和数据拼接成一个完整正常的svg图形
    const svg = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="${viewport.width}"
            height="${viewport.height}"
            viewBox="${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}"
            >
            ${context}
          </svg>
        `;
    // 将文件名以及数据交给下载方法
    download({name: name, data: svg});
  } catch (error) {
    console.error('下载Svg失败，请重试')
  }
}
// 撤销
const handelCancel = () => {
  console.log('点击撤销')
  state.bpmnModeler.get("commandStack").undo();

}
//恢复
const handelReset = () => {
  console.log('点击恢复')
  state.bpmnModeler.get("commandStack").redo()
}
//放大/缩小
const handlerZoom = (radio) => {
  const newScale = !radio ? 1.0 : state.scale + radio;
  state.bpmnModeler.get("canvas").zoom(newScale);
  state.scale = newScale;
}
// 预览Xml
const viewXml = async () => {
  try {
    const {xml} = await state.bpmnModeler.saveXML({format: true});
    bpmnValue.value = xml
    showView.value = true
  } catch (error) {
    this.toast.error('预览失败，请重试')
  }
}
// 预览svg
const viewSvg = async () => {
  try {
    const {svg} = await state.bpmnModeler.saveSVG();
    bpmnValue.value = svg
    showView.value = true
  } catch (error) {
    console.error('预览失败，请重试')
  }
}
onMounted(() => {
  init()
})
</script>
<style lang='scss' scoped>
.nav {
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;

  button {
    margin-right: 10px;
  }
}

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

  .showViewClass {
    position: absolute;
    z-index: 2;
    width: 800px;
    height: 600px;
    top: calc(50% - 300px);
    left: calc(50% - 400px);
    background-color: #f9f9f9;
    display: flex;
    justify-content: center;
    align-items: center;

    .closeView {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
