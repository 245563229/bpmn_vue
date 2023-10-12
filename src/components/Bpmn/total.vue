<template>
  <div class="totalClass">
    <a hidden ref="downloadLink"></a>
    <el-button>
      导入流程
      <input type="file" @change="importXml"/>
    </el-button>
    <el-button @click="exportXml" type="info">
      导出XML
    </el-button>
    <el-button @click="exportSvg" type="info">
      下载svg
    </el-button>
    <el-button @click="viewSvg" type="info">
      svg预览
    </el-button>
    <el-button @click="handelCancel" type="danger">
      撤销
    </el-button>
    <el-button @click="handelReset" type="warning">
      恢复
    </el-button>
    <el-button @click="handlerZoom(0.2)" type="primary">
      放大
    </el-button>
    <el-button @click="handlerZoom(-0.2)" type="primary">
      缩小
    </el-button>
    <!--    <el-button @click="viewXml">-->
    <!--      xml预览-->
    <!--    </el-button>-->

  </div>
  <div v-if="showView" class="showViewClass" ref="shouViewDiv">
    <button class="closeView" @click="showView=false">关闭预览</button>
    <div style="text-align: center;" v-html="bpmnValue"></div>
  </div>
</template>
<script setup>
import {ref, reactive, onMounted} from 'vue'
const shouViewDiv = ref()
const state = reactive({
  //bpmn建模
  bpmnModeler: null,
  //放大倍率
  scale: 1
})
const props = defineProps({
  BpmnModeler:{z}
})
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
})
</script>
<style lang='scss' scoped>
.totalClass{
  position: absolute;
  display: flex;
  z-index: 2;
  height: 50px;
  top: 0;
  left: 0;
}
</style>
