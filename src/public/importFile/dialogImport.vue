<template>
  <div class="el-contain-div regulatory-class">
    <div class="el-main" style="display: block;max-height:80vh">
      <div class="import-pop">
        <el-row>
          <el-col>
            <div class="choose-wrap">
              <span class="label">选择文件：</span>
              <span class="choose-content" v-show="!fileName">
                <input class="input-style" type="file" name='excelFile' ref="fileInp"
                       accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                       @change="chooseFile($event)"/>
                <span>
                  <span style="display: flex;align-items: center">
                    <el-icon :size="18" color="#3a9fff"><UploadFilled/></el-icon>
                  <span ref="upStr">上传文件</span>
                  </span>
                </span>
              </span>
              <div v-show="fileName" style="display: flex; align-items: center;">
                <div class="choose-file-name" :title="fileName">{{ fileName }}
                </div>
                <el-icon @click="clearFile" style="margin-left:5px;color: orangered;cursor: pointer">
                  <CircleCloseFilled/>
                </el-icon>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="tip">
              <p class="tip-item">
                1.Excel需要数据模板中样式保持一致
                <a @click="download">下载模板</a>
              </p>
              <p class="tip-item">2.支持3MB以内的xls、xlsx格式文件</p>
              <p class="tip-item" v-if="hintStr"><span style="color:red;">{{ hintStr }}</span></p>
            </div>
          </el-col>
        </el-row>
        <div class="pop-footer-button">
          <el-button @click="onClose" size="default" :disabled="btnCancel">取&nbsp;消</el-button>
          <el-button type="primary" size="default" @click="submit" :loading="btnImportLoading">导&nbsp;入</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    hintStr: {//错误提示语
      type: String,
      default: ''
    },
    implUnid: {
      type: String,
      default: ''
    },
    /*下载地址*/
    downloadExcelUrl: {
      type: String,
      default: ''
    },
    /*报错时候下载错误文件地址*/
    downloadErrUrl: {
      type: String,
      default: ''
    },
    /*上传的接口方法*/
    importDataFromExcel: {
      type: Function,
      default: function () {
      }
    },
    /*上传的附加参数*/
    uploadData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      fileName: "",//文件名
      file: null,//文件
      btnCancel: false,
      btnImportLoading: false,
    };
  },
  created() {
    // alert(1);
  },
  methods: {

    onClose() {
      this.$emit('onClose')
    },
    submit() {
      if (!this.file) {
        this.$message.warning('请先选择文件');
        return
      }
      let obj = new FormData();
      obj.append('file', this.file);
      if (this.uploadData) {
        for (let key of Object.keys(this.uploadData)) {
          obj.append(key, this.uploadData[key]);
        }
      }
      //提交文件
      this.setBtnState(true);

      this.importDataFromExcel(obj).then(res => {
        this.setBtnState(false);
        this.handleSuccess(res.data)
      }).catch(err => {
        this.setBtnState(false);
        console.log(err);
        let errStr = '';
        if (err.data && err.data.code == 7) {
          if (typeof err.data.data == 'string') {
            if (!this.isStringEmpty(err.data.data)) {
              this.hintMsg(err.data.data);
            }
          }
        } else {
          if (err.data && err.data.msg) {
            errStr = err.data.msg
          } else if (err.message) {
            errStr = err.message;
          } else {
            errStr = '服务器忙'
          }
          this.handleError(errStr, null, null);
        }
      })
    },
    setBtnState(boolean) {
      this.btnCancel = boolean;
      this.btnImportLoading = boolean;
    },

    handleError(err) {
      this.$confirm(err, '温馨提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {

      }).catch(() => {

      });
      this.disabled = false;
      this.btnImportLoading = false;
      this.btnCancel = false;
      this.fileList = [];
    },
    handleSuccess(response) {
      this.disabled = false;
      if (null != response && response.code != 200) {
        this.handleError(response.data)
      } else if (null != response && response.code == 200) {
        if (response.data && response.data.length > 0) {
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            let msg = "";
            for (let [index, item] of response.data.entries()) {
              if (!this.isStringEmpty(item)) {
                if (index == response.data.length - 1) {
                  msg += item;
                } else {
                  msg += item + ","
                }
              }
            }
            this.hintMsg(msg);
          } else if (typeof response.data == 'string') {
            if (!this.isStringEmpty(response.data)) {
              this.hintMsg(response.data);
            }
          }
        } else {
          this.$message.success('导入成功');
          this.$emit('onClose', true);
        }

      } else {
        this.handleError(response.msg, '', '')
      }

    },
    /*提示错误消息*/
    hintMsg(msg) {
      this.$confirm("导入文件出错，是否下载错误提示文件：" + msg, '温馨提示', {
        confirmButtonText: '下载',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let downloadErrUrl = this.downloadErrUrl + encodeURIComponent(msg);

        window.open(downloadErrUrl);
      }).catch(() => {

      });
    },
    //选择了文件
    chooseFile($event) {
      let file = $event.target.files[0];
      let ext = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      if (ext === 'xls' || ext === 'xlsx') {
        let maxSize = 1024 * 1024 * 3;//文件最大3MB
        if (file.size > maxSize) {
          this.fileName = '';
          this.file = null;
          $event.target.value = '';
          this.$message.warning('文件不能大于3MB');
        } else {
          this.fileName = file.name;
          this.file = file;
        }

      } else {
        this.fileName = '';
        this.file = null;
        $event.target.value = '';
        this.$message.warning('请上传xls或xlsx格式文件');
      }

    },
    //清除文件
    clearFile() {
      this.$refs.fileInp.value = '';
      this.fileName = '';
      this.file = null;
    },
    /*/man-ele-power/exportExcel导出模板*/
    download() {
      let url = this.downloadExcelUrl;
      window.open(url);
    },


    isStringEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj === "" || !obj || typeof obj != "string") {
        return true;
      } else {
        return false;
      }
    },
    isStringNotEmpty(obj) {
      return !this.isStringEmpty(obj);
    },

    changeStringEmptyToNull(obj) {
      if (this.isStringEmpty(obj)) {
        obj = null;
      }
      return obj;
    }
  }
};
</script>
<style lang="scss" scoped>
.input-style {
  font-size: 0;
  cursor: pointer
}

.input-style:hover + .text-str {
  color: #0000ff;
}

.import-pop {
  font-size: 14px;

  .choose-wrap {
    padding: 10px 78px;

    .label {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      color: #666666;
    }

    .text-str {
      color: #0000ff;
    }

    .choose-content {
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      width: auto;
      height: auto;
      position: relative;
      color: #666666;

      input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }

    }

    choose-content:hover {
      color: #399cfa;
    }

    .choose-file-name {
      display: inline-block;
      vertical-align: middle;
      overflow: hidden; //超出部分隐藏
      text-overflow: ellipsis; //超出部分显示省略号
      white-space: nowrap; //不允许折行
      word-break: break-all;
      max-width: 400px;
      color: #399cfa;

      span {
        color: #399cfa;
      }

      i {
        margin-left: 3px;
        cursor: pointer;
        color: #399cfa;

        &:hover {
          color: #708ba5;
        }
      }
    }
  }

  .tip {
    padding: 0 78px 32px;

    .tip-item > a {
      color: #399cfa;
      text-decoration: none;
      cursor: pointer;
    }
  }
}
</style>

