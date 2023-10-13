<template>
  <div class="nav">
    <a hidden ref="downloadLink"></a>
    <!--    <el-button type='info' @click="createNewDiagram">-->
    <!--      新建流程-->
    <!--    </el-button>-->
    <slot/>
    <el-button type='info' @click="exportXml">
      导出XML
    </el-button>
    <el-button type='info' @click="exportSvg">
      下载svg
    </el-button>
    <el-button type='info' @click="handelCancel">
      撤销
    </el-button>
    <el-button type='info' @click="handelReset">
      恢复
    </el-button>
    <el-button type='info' @click="handlerZoom(0.2)">
      放大
    </el-button>
    <el-button type='info' @click="handlerZoom(-0.2)">
      缩小
    </el-button>
    <el-button type='info' @click="viewSvg">
      svg预览
    </el-button>
  </div>
  <div v-if="showView" class="showViewClass" ref="shouViewDiv">
    <el-button type='info' class="closeView" @click="showView=false">关闭预览</el-button>
    <div style="text-align: center;" v-html="bpmnValue"></div>
  </div>
</template>
<script setup>
import {ref, reactive, onMounted, toRefs} from 'vue'
const state = reactive({
  scale:1
})
const props = defineProps({
  bpmnModeler: {},
  canvasBpmn:{}
})
const {bpmnModeler,canvasBpmn} = toRefs(props)
const downloadLink = ref()
//预览弹窗
const showView = ref(false)
//编辑器内容
const bpmnValue = ref()
const shouViewDiv = ref()

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
    const {xml} = await bpmnModeler.value.saveXML({format: true});
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
    const {xml} = await bpmnModeler.value.saveXML({format: true});
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
  bpmnModeler.value.get("commandStack").undo();
}
//恢复
const handelReset = () => {
  console.log('点击恢复')
  bpmnModeler.value.get("commandStack").redo()
}
//放大/缩小
const handlerZoom = (radio) => {
  const newScale = !radio ? 1.0 : state.scale + radio;
  bpmnModeler.value.get("canvas").zoom(newScale);
  state.scale = newScale;
}

// 预览svg
const viewSvg = async () => {
  try {
    const {svg} = await bpmnModeler.value.saveSVG();
    bpmnValue.value = svg
    showView.value = true
  } catch (error) {
    console.error('预览失败，请重试')
  }
}
onMounted(() => {
})
</script>
<style lang='scss' scoped>
.nav {
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
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
</style>
