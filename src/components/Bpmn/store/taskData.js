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
            let newList = this.taskData.filter((ele) => {
             return allElement.find((item) => {
                    return  item.id === ele.id
                })
            })
            this.taskData = newList
        },
        setElement(element) {
            this.taskData.push(element)
        }
    }
})