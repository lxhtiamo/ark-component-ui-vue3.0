<template style="margin:0 auto">
        <el-table
                :show-header="isShowHead"
                :data="tableData">
            <el-table-column
                    prop="title"
                    label="名称"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="value"
                    label="内容">
            </el-table-column>
        </el-table>
</template>

<script>
    export default {
        name: "detailInfo",
        props: ["tableData"],
        data() {
            return {
                isShowHead: false,
            }
        }
    }
</script>