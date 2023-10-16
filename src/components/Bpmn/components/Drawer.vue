<template>
  <el-drawer
    v-model="state.drawerView"
    direction="btt"
    :before-close="handleDrawerClose"
    class="drawerClass"
    size="40%"
    :destroy-on-close="true"
  >
    <template #header>
      <div class="headerClass">
        用户任务
      </div>
    </template>
    <div class="drawerContentClass">
      <el-form style="width: 100%;" :model="state.taskData" label-width="140px" :inline="true">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="任务名称">
<el-input v-model="state.taskData.taskName"></el-input>
            </el-form-item>
            <el-form-item label="处理人类型">
              <div>
                <el-radio-group v-model="state.taskData.executeType" class="ml-4">
                  <el-radio label="1" size="large">按角色</el-radio>
                  <el-radio label="2" size="large">按部门</el-radio>
                  <el-radio label="3" size="large">按用户</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="处理人">
              <el-select v-model="state.taskData.execute" class="m-2" placeholder="Select" size="large">
                <el-option label="测试1" value="1"/>
                <el-option label="测试2" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否可以退回">
              <div class="mb-2 flex items-center text-sm">
                <el-radio-group v-model="state.taskData.resetWhether" class="ml-4">
                  <el-radio label="1" size="large">是</el-radio>
                  <el-radio label="2" size="large">否</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="是否可以结束流程">
              <div class="mb-2 flex items-center text-sm">
                <el-radio-group v-model="state.taskData.overWhether" class="ml-4">
                  <el-radio label="1" size="large">是</el-radio>
                  <el-radio label="2" size="large">否</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进入条件">
              <el-input
                v-model="state.taskData.inputIf"
                :rows="2"
                type="textarea"
                placeholder="请输入进入条件"
              />
            </el-form-item>
            <el-form-item label="完成条件">
              <el-input
                v-model="state.taskData.outputIf"
                :rows="2"
                type="textarea"
                placeholder="请输入完成条件"
              />
            </el-form-item>
            <el-form-item label="结束条件">
              <el-input
                v-model="state.taskData.overIf"
                :rows="2"
                type="textarea"
                placeholder="请输入结束条件"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-drawer>
</template>
<script setup>
import {ref, reactive, onMounted, toRefs, watch} from 'vue'
// 引入pinia
import taskData from '../store/taskData.js'

const taskDateStore = taskData()
const props = defineProps({
  drawerView: {
    type: Boolean,
    required: true
  },
  taskId: {
    required: true
  },
  bpmnModeler:{

  }

})
const {drawerView, taskId,bpmnModeler} = toRefs(props)
const emits = defineEmits(['closeDrawer'])
const state = reactive({
  drawerView: false,
  // 用户框额外数据
  taskData:
    {
      id: '',
      executeType: '',
      execute: '',
      inputIf: '',
      outputIf: '',
      overIf: '',
      resetWhether: '',
      overWhether: '',
      taskName:''
    }
})
// 重置state.taskData
const reset = () => {
  state.taskData = {
    id: '',
    executeType: '',
    execute: '',
    inputIf: '',
    outputIf: '',
    overIf: '',
    resetWhether: '',
    overWhether: '',
    taskName:''
  }
}
// Drawer关闭
const handleDrawerClose = () => {
  console.log('taskData', taskDateStore.taskData)
  const element = bpmnModeler.value.get('elementRegistry').get(state.taskData.id)
  const modeling = bpmnModeler.value.get('modeling')
  modeling.updateLabel(element, state.taskData.taskName)
  const index = taskDateStore.taskData.findIndex((item) => item.id === state.taskData.id)
  if (index >= 0) {
    taskDateStore.editElement(index, state.taskData)
  } else {
    taskDateStore.setElement(state.taskData)
  }
  emits('closeDrawer')
}
watch(
  () => props.drawerView,
  (value) => {
    if (value) {
      const storeData = taskDateStore.taskData.find(item => item.id === taskId.value)
      if (storeData) {
        state.taskData = storeData
      } else {
        state.taskData.id = taskId.value
      }
    } else {
      reset()
    }
    state.drawerView = drawerView.value

  }
)
onMounted(() => {

})
defineExpose({reset})
</script>
<style lang='scss' scoped>
</style>
