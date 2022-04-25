<template style="margin:0 auto">
  <el-table
      :data="tableData"
      :show-header="isShowHead">
    <el-table-column
        label="名称"
        prop="title"
        width="250">
    </el-table-column>
    <el-table-column
        label="内容"
        prop="value">
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