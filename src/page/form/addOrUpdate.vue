<template>
  <div class="addorupdate-form">
    <el-dialog
      :close-on-click-modal="false"
      v-model="dialogFormVisible"
      :beforeClose="close"
      :title="title"
    >
      <el-form
        ref="form"
        :rules="rule"
        :model="formData"
        label-width="100px"
        style="margin-left: 10px"
      >
        <el-row>
          <el-col :span="22">
            <el-row :span="24">
              <el-col :span="12">
                <el-form-item label="用户名:" prop="username">
                  <el-input v-model="formData.username" size="default"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型:" prop="type">
                  <el-select v-model="formData.type" placeholder="请选择类型">
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
              <el-form-item label="stars:" prop="stars">
                <el-input v-model="formData.stars" size="default"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="码云:" prop="address">
                <el-input v-model="formData.address" size="default"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="22">
            <el-form-item label="介绍:" prop="info">
              <el-input
                v-model="formData.info"
                type="textarea"
                resize="none"
                :autosize="{ minRows: 2, maxRows: 6 }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="position: relative;margin-bottom:20px;text-align: center;">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import rule from "./rule";

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
      rule: rule,
      title: "表单标题",
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
  computed: {},
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
        this.title = "编辑";
        this.reset();
        this.formData = Object.assign(this.formData, row);
      } else {
        // 新增
        this.title = "新增";
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
