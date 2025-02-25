<template>
    <div class="p-5">
        <input type="file" ref="fileRef" @change="handleExcel()" />
        <div>选项：
            <label><input type="checkbox" v-model="optionState.ignoreFirstRowData">忽略第一行数据</label>
        </div>
        <div>输入列名(以_开头的列数据将被忽略)，以','分割（未输入时由第一行数据自动生成）: <input class="w-full" type="text" v-model="inputHeaders" placeholder="输入列名，以','分割"></div>
        <Button @click="handleExcel">生成</Button>
        <Button type="primary" :disabled="!hasSelected" @click="setHeader">
            设为表头
        </Button>
        
        <Table 
            :row-key="(record,index)=>record.id || index" 
            :row-selection="{ selectedRowKeys: selectState.selectedRowKeys, onChange: onSelectChange }" 
            :dataSource="excelData" 
            :columns="excelHeaders"
        ></Table>
        <div class="relative">
            <textarea class="w-full" ref="textareaRef">
                {{ jsonResult }}
            </textarea>
            <Button class="absolute right-0 top-0" type="primary" @click="()=>copy(jsonResult)">
                复制
            </Button>
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref } from 'vue';
import { GExcel } from '../../../utils/excel';
import { Button, Table } from 'ant-design-vue'
import { Key } from 'ant-design-vue/es/table/interface';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const fileRef = ref()
const textareaRef = ref()
const inputHeaders = ref('')
const excelData = ref()
const excelHeaders = ref()
const jsonResult = ref()
const {copy} = useCopyToClipboard({})
const optionState = reactive({
    ignoreFirstRowData: true
})

// 选中操作
const selectState = reactive({
  selectedRowKeys: [] as Key[],
  selectedRow: [] as any[]
});
const hasSelected = computed(() => selectState.selectedRowKeys.length > 0);
const onSelectChange = (selectedRowKeys: Key[], selectedRow: any[]) => {
  selectState.selectedRowKeys = selectedRowKeys;
  selectState.selectedRow = selectedRow;
};

// 覆盖表头
function setHeader(){
    inputHeaders.value = Object.values(selectState.selectedRow.values().next().value).join(',')
    handleExcel()
    selectState.selectedRow = []
    selectState.selectedRowKeys = []
}

// excel2json
function handleExcel(){
    const file = (fileRef.value as HTMLInputElement).files?.[0]
    const fr = new FileReader()
    fr.onload = async(e)=>{
        const blob = new Blob([e.target?.result as ArrayBuffer],{ type: file?.type })
        const gExcel = new GExcel(blob)
        const headers = inputHeaders.value.split(',').filter(item=>item.trim().length)
        const result = await gExcel.toJson({ headers, ...optionState })
        excelData.value = result.data
        excelHeaders.value = result.headers.map(item=>({
            dataIndex: item,
            title: item,
        }))
        if(!inputHeaders.value) inputHeaders.value = result.headers.join(',')
        jsonResult.value = JSON.stringify(excelData.value, null, 4)
        nextTick(autoTextareaHeight)
    }
    fr.readAsArrayBuffer(file as File)
    
}

// 自动调整textarea高度
function autoTextareaHeight(){
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
}
</script>