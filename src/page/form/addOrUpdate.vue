<template>
  <div class="addorupdate-form">
    <el-dialog
        v-model="dialogFormVisible"
        :beforeClose="close"
        :close-on-click-modal="false"
        :title="title"
    >
      <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="100px"
          style="margin-left: 10px"
      >
        <el-row>
          <el-col :span="22">
            <el-row :span="24">
              <el-col :span="12">
                <el-form-item :label="$t('message.userName')" prop="username">
                  <el-input v-model="formData.username" size="default"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('message.type')" prop="type">
                  <el-select v-model="formData.type" :placeholder="$t('message.pleaseSelectType')">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="22">
            <el-col :span="12">
              <el-form-item label="stars" prop="stars">
                <el-input v-model="formData.stars" size="default"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('message.codeCloud')" prop="address">
                <el-input v-model="formData.address" size="default"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('message.suggest')" prop="info">
              <el-input
                  v-model="formData.info"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  resize="none"
                  type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="position: relative;margin-bottom:20px;text-align: center;">
        <el-button type="primary" @click="save">{{ $t('message.conserve') }}</el-button>
        <el-button @click="close">{{ $t('message.close') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as publicRule from "../../rules/rules";

export default {
  props: ["unid"],
  data() {
    return {
      options: [
        {
          value: "0",
          label: "前端",
        },
        {
          value: "1",
          label: "后端",
        },
      ],
      title: "",
      activeName: "first",
      appealPeopleType: {
        personal: "个人",
        ent: "企业",
      },
      activeNames: [0],
      activeValue: {
        trueData: true,
        falseData: false,
      },
      formData: {
        unid: "",
        username: "",
        name: "",
        number: "",
        type: "",
        stars: "",
        git: "",
        address: "",
        info: "",
      },
      mark: [],
      showFlag: false,
      flag: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  computed: {
      /*表单的验证信息中的国际化必须这样放在计算属性中,要不然切换语言就不生效*/
      rules() {
          const rules ={
              username: [
                  {
                      required: true,
                      message: this.$t('message.enterOneUserName'),
                      trigger: "blur",
                  },
                  { required: true, trigger: "blur", validator: publicRule.enCnChar },
              ],
              type: [
                  {
                      required: true,
                      message:  this.$t('message.pleaseSelectType'),
                      trigger: "change",
                  },
                  { required: true, trigger: "change", validator: publicRule.enCnChar },
              ],
          };
          // 清空表单验证信息
          this.$nextTick( () => {
              this.$refs['form'].resetFields();
          })
          return rules;
      }
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.close();
          if (this.formData.unid) {
            // 编辑
            this.$emit("saveOrUpdate", this.formData);
          } else {
            // 新增
            this.$emit("saveOrUpdate", this.formData);
          }
        }
      })
    },
    close() {
      this.dialogFormVisible = false;
    },
    setTrue(row) {
      //console.log(row);
      if (row.unid) {
        // 编辑
        this.title = this.$t('message.edit');
        this.reset();
        this.formData = Object.assign(this.formData, row);
      } else {
        // 新增
        this.title = this.$t('message.add');
        this.reset();
      }
      this.dialogFormVisible = true;
    },
    reset() {
      for (let key of Object.keys(this.formData)) {
        this.formData[key] = "";
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },
    getDetail() {
      // 获取详情
      // getDetail(this.unid).then((res) => {
      //   let data = res.data.data;
      //   this.formData = data;
      //   this.formData.sucessFlag = this.formData.sucessFlag + "";
      //   this.activeName = "first";
      // });
    },
  },
};
</script>

<style lang="scss">
.addorupdate-form {
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
