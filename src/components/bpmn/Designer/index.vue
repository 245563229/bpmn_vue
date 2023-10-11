<template>
  <div ref={designer} class="designer"></div>
</template>
<script setup name="designer">
import {ref, toRefs, nextTick, watch} from 'vue'
import {storeToRefs} from 'pinia'
import editor from '@/store/editor.js'
import modulesAndModdle from '@/components/Bpmn/Designer/modulesAndModdle'
import initModeler from '@/components/Bpmn/Designer/initModeler'
import {createNewDiagram} from '@/utils'

const props = defineProps(
  {
    xml: {
      type: String,
      default: undefined
    }
  }
)
const emits = defineEmits(['update:xml', 'command-stack-changed'])
const {editorSettings} = storeToRefs(editor())
const {xml} = toRefs(props)
const designer = ref(null)
watch(
  editorSettings,
  async (value, oldValue) => {
    try {
      const modelerModules = modulesAndModdle(editorSettings)
      await nextTick()
      initModeler(designer, modelerModules, emit)
      if (!oldValue || value.processEngine !== oldValue.processEngine
      ) {
        await createNewDiagram()
      } else {
        await createNewDiagram(xml.value, editorSettings.value)

      }
    } catch (e) {
      console.log(e)

    }
  },
  {deep: true, immediate: true}
)

onMounted(() => {
})
</script>
<style lang='scss' scoped>
</style>