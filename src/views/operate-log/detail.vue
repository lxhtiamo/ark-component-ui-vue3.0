<template>
  <div class="operate-page">
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" :beforeClose="close" title="操作日志详情">
      <el-form ref="form" label-width="100px" style="margin-left: 10px">
        <el-row>
          <el-col :span="22">
            <el-row :span="24">
              <el-col :span="12">
                <el-form-item label="系统名称:" prop="systemName">
                  <el-input v-model="appealInfo.systemName" size="mini"
                            :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="菜单名称:" prop="menu">
                  <el-input v-model="appealInfo.menu" size="mini"
                            :readonly="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-col :span="12">
              <el-form-item label="操作人姓名:" prop="operatorName">
                <el-input v-model="appealInfo.operatorName" size="mini"
                          :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作人IP:" prop="operatorIp">
                <el-input v-model="appealInfo.operatorIp" size="mini"
                          :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="22">
            <el-col :span="12">
              <el-form-item label="操作结果:" prop="sucessFlag">
                <el-input v-model="appealInfo.sucessFlag" size="mini"
                          :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作时间:" prop="operateTime">
                <el-input v-model="appealInfo.operateTime" size="mini"
                          :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="22">
            <el-form-item label="操作内容:" prop="content">
              <el-input v-model="appealInfo.content"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 6}"
                        :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="position: relative;margin-bottom:20px;text-align: center;">
        <el-button @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.operate-page{
  table tr td:nth-child(1) {
    width: 150px;
  }

  table tr td:nth-child(2) {
    width: 230px;
  }

  table tr td:nth-child(3) {
    width: 120px;
  }

  table tr td:nth-child(4) {
    width: 150px;
  }

  .my-table {
    margin-bottom: 50px;
    height: 180px;
  }

  .title {
    width: 110px;
    height: 35px;
    background-color: rgb(25, 158, 216);
    position: relative;
    left: -20px;
    font-size: 14px;
    text-align: center;
    line-height: 35px;
    margin-bottom: 10px;
  }

  .temp {
    margin: 0 auto;
    width: 300px;
    height: 80px;
    text-align: center;
    -webkit-box-orient: vertical;
    -webkit-box-align: center;
    display: -webkit-box;
    -webkit-box-pack: center;
  }
}

</style>


<script>
import {getDetail} from '../../api/operate-log'

export default {
  props: [
    "unid"
  ],
  data() {
    return {
      activeName: 'first',
      appealPeopleType: {
        personal: "个人",
        ent: "企业"
      },
      activeNames: [0],
      activeValue: {
        trueData: true,
        falseData: false,
      },
      appealInfo: {
        operatorName: '',
        operatorIp: '',
        systemName: '',
        menu: '',
        content: '',
        sucessFlag: '',
        operateTime: ''
      },
      mark: [],
      showFlag: false,
      flag: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    };
  },
  watch: {
    unid: function () {
      this.getDetail();
    }
  },
  computed: {},
  methods: {
    submit() {
      this.$emit("setReason", this.reason.remark);
      this.close();
    },
    close() {
      this.dialogFormVisible = false;
    },
    setTrue() {
      this.dialogFormVisible = true;
    },
    getDetail() {
      getDetail(this.unid).then(res => {
        let data = res.data.data;
        this.appealInfo = data;
        this.appealInfo.sucessFlag = this.appealInfo.sucessFlag ? '成功':'失败';
        this.activeName = 'first';
      })
    }
  }
};
</script>
