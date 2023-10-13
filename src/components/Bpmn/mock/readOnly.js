import translate from '../assets/translations.js'

export const readOnlyJs=   {
            translate: ['value', translate],
            __init__: [
                "labelEditingProvider"
            ],
            paletteProvider: ["value", ''], //禁用/清空左侧工具栏
            labelEditingProvider: ["value", ''], //禁用节点编辑
            contextPadProvider: ["value", ''], //禁用图形菜单
            bendpoints: ["value", {}], //禁用连线拖动
            // zoomScroll: ["value", ''], //禁用滚动
            // moveCanvas: ['value', ''], //禁用拖动整个流程图
            move: ['value', ''], //禁用单个图形拖动,
        }