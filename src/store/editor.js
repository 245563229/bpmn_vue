import {defineStore} from 'pinia'
import {defaultSettings} from '@/config'

const state = {
    editorSettings: {
        processId: `Process_${new Date().getTime()}`,
        processName: `业务流程`,
        processEngine: 'camunda',
        paletteMode: 'enhancement',
        penalMode: 'custom',
        contextPadMode: 'enhancement',
        rendererMode: 'rewrite',
        bg: 'grid-image',
        toolbar: true,
        miniMap: true,
        contextmenu: true,
        customContextmenu: true,
        otherModule: true,
        templateChooser: true,
        useLint: false,
        customTheme: {}
    }
}

export default defineStore('editor', {
    state: () => state,
    getters: {
        getProcessDef: (state) => ({
            processName: state.editorSettings.processName,
            processId: state.editorSettings.processId
        }),
        getProcessEngine: (state) => state.editorSettings.processEngine,
        getEditorConfig: (state) => ({
            bg: state.editorSettings.bg,
            paletteMode: state.editorSettings.paletteMode,
            penalMode: state.editorSettings.penalMode,
            contextPadMode: state.editorSettings.contextPadMode,
            rendererMode: state.editorSettings.rendererMode,
            toolbar: state.editorSettings.toolbar,
            miniMap: state.editorSettings.miniMap,
            contextmenu: state.editorSettings.contextmenu,
            customContextmenu: state.editorSettings.customContextmenu,
            otherModule: state.editorSettings.otherModule,
            templateChooser: state.editorSettings.templateChooser,
            useLint: state.editorSettings.useLint,
            customTheme: state.editorSettings.customTheme
        })
    },
    actions: {
        updateConfiguration(conf) {
            this.$state.editorSettings = {...this.$state.editorSettings, ...conf}
        }
    }
})
