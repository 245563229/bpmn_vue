import {defineStore} from 'pinia'

export default defineStore('taskData', {
    state: () => ({
            taskData:[]
        }),
    getters: {
        getTaskData: (state) => this.taskData,
    },
    actions: {
        editElement(index,element){
            this.taskData[index] = element
        },
        updataElement(allElement) {
            const newList = this.taskData.filter((ele) => {
                const newData = allElement.filter((item) => {
                    return item.id == ele.id
                })
            })
            this.taskData = newList
        },
        setElement(element) {
            this.taskData.push(element)
        }
    }
})