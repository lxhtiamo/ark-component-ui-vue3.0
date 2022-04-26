<!--添加服务消息管理表详情-->
<template>
  <div v-loading="loading" class="tab-cnt-details">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="info">
        <detailInfo :tableData="tableData"></detailInfo>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {findByUnid} from "@/api/abilityMessage";
import detailInfo from "@/public/detailInfo";
import * as util from "@/util/util.js";

export default {
  name: "detail",
  components: {detailInfo},
  props: ['itemData'],
  data() {
    return {
      loading: false,
      activeName: 'info', //默认选中第一项
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.findDetail(this.itemData.unid)
  },
  beforeUnmount() {
  },
  unmounted() {
  },
  methods: {
    handleClick(tab) { //标签切换

    },
    /*详情接口*/
    findDetail(unid) {
      let parameter = {
        unid: unid,
      };
      findByUnid(parameter)
          .then(res => {
            this.form = res.data.data;
            this.editData();
          })
          .catch();
    },
    /*重新组织数据给第一个详情的tab标签使用*/
    editData() {
      let map1 = new Map();
      map1.set('title', '标题');
      map1.set('type', '消息类型');
      map1.set('relateUnid', '服务主键');
      map1.set('readStatus', '已读标志');
      map1.set('createTime', '创建时间');
      map1.set('deleteFlag', '逻辑删除');
      map1.set('createUnid', '创建人标识');
      map1.set('createName', '创建人名称');
      map1.set('updateUnid', '更新人标识');
      map1.set('updateName', '更新名称');
      map1.set('sendUnid', '消息发送对象主键');
      map1.set('sendName', '消息发送对象名称');
      this.tableData = util.objToArraySort(this.form, map1);
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
