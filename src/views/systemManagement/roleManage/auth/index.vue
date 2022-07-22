<template>
  <el-dialog :title="title" v-model="dialogFormVisible" :before-close="closedDialog" :close-on-click-modal="false"
             custom-class="dialog-styles">
    <div class="auth-div-style">
      <div class="a-title-style">
        <span :class="[selectItem=='0'?'_active':'']" @click="selectItem='0'">菜单授权</span>
        <span></span>
        <span :class="[selectItem=='1'?'_active':'']" @click="selectItem='1'">区域授权</span>
      </div>
      <div class="auth-content-div">
        <menu_auth v-bind="$attrs" v-show="selectItem=='0'" ref="resRef"></menu_auth>
        <area_auth v-bind="$attrs" v-show="selectItem=='1'" ref="areaRef"></area_auth>
      </div>
    </div>
    <template v-slot:footer>
      <div>
        <el-button @click="closedDialog()">关闭</el-button>
        <el-button type="primary" :loading="loading" @click="submitData">确定</el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script>
import menu_auth from "./menu_auth";
import area_auth from "./area_auth";
import {saveRoleOrg} from '@/api/applicationManageApi'
import {role_saveRoleMenu} from '@/api/systemManageApi'

export default {
  name: "authorizeDialog",
  components: {menu_auth, area_auth},
  inheritAttrs: false,//外部 传递参数不接收,默认是true
  data() {
    return {
      title: '授权信息',
      dialogFormVisible: true,
      loading: false,
      selectItem: '0'
    }

  },
  mounted() {

  },
  methods: {
    closedDialog() {
      this.$emit('closed')
    },
    submitData() {
      this.loading = true;
      let resData = this.$refs.resRef.getResData()
      let areaData = this.$refs.areaRef.getData()
      Promise.all([this.subRes(resData), this.subArea(areaData)])
          .then(() => {
            this.loading = false;
            this.$util.showMessage('授权成功', '1');
            this.closedDialog();
          })
          .catch(() => {
            this.loading = false;
            this.$util.showMessage('授权失败');
          })
    },

    subRes(data) {
      return new Promise((resolve, reject) => {
        role_saveRoleMenu(data)
            .then(res => {
              // this.$util.showMessage('授权成功', '1');
              resolve(res)
            })
            .catch(err => {
              reject(err)
              this.$util.showMessage(err)
            })
      })
    },
    subArea(data) {
      return new Promise((resolve, reject) => {
        saveRoleOrg(data)
            .then(res => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
              this.$util.showMessage(err)
            })
      })
    },
  },
}
</script>
<style lang="scss">
.dialog-styles {
  height: 60vh !important;
  width: 40vw !important;

  .el-dialog__body {
    height: calc(100% - 110px);
  }
}
</style>
<style lang="scss" scoped>

.auth-div-style {
  width: 100%;
  height: 100%;

  .a-title-style {
    width: 100%;
    height: 35px;
    box-sizing: border-box;
    border-bottom: 1px solid #efefef;

    span:first-child, :last-child {
      font-size: 16px;
      color: #333333;
      height: 35px;
      font-weight: 500;
      line-height: 0px;
      cursor: pointer;

      &._active {
        color: #3379fd;
      }
    }

    span:nth-child(2) {
      display: inline-block;
      margin: 0 10px;
      height: 20px;
      background: #8c939d;
      width: 2px;
      position: relative;
      top: 4px;
    }
  }

  .auth-content-div {
    width: 100%;
    height: calc(100% - 35px);
  }
}


</style>