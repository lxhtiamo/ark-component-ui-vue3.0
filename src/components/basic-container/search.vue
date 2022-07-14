<template>
  <div>
    <el-input
        v-model.trim="value"
        :placeholder="placeholder"
        class="searchClass"
        maxlength="20"
        @keyup.enter="searchEnterFun">
      <template #append>
        <el-button circle icon="Search" @click="searchData"></el-button>
      </template>
    </el-input>
  </div>
</template>

<script>
import * as publicRule from "@/rules/rules.js";

export default {
  props: ["placeholder"],
  name: "search",
  data() {
    return {
      value: ""
    };
  },
  methods: {
    searchData() {
      if (publicRule.searchRule(this.value)) {
        this.validata();
      } else {
        this.$message.warning("包含特殊字符，不支持查询")
      }

    },
    getContent() {
      return this.value;
    },
    searchEnterFun(e) {
      let keyCode = window.event ? e.keyCode : e.which;
      if (keyCode === 13) {
        this.validata();
      }
    },
    validata() {
      publicRule.passHtmlAndSql(null, this.value, err => {
        if (err) {
          this.$message.error(err.message);
        } else {
          this.$emit("searchData");
        }
      });
    }
  }
};
</script>

<style lang="scss">
.searchClass {
  border: 1px solid #e3e3e3;
  /*background: #f4f4f4;*/
  width: 260px;
  box-sizing: border-box;
  border-radius: 100px;
}

.el-input-group--append > .el-input__wrapper {
  background-color: transparent;
  box-shadow: none;
}

.searchClass .el-input-group__append {
  border: none;
  padding: 0 20px 0 0;
  background-color: transparent;
}

.searchClass .el-input__inner {
  height: 32px;
  box-sizing: border-box;
  line-height: 32px;
  border: none;
  background-color: transparent;
}

.searchClass .el-input-group__append {
  box-shadow: none;
}
</style>
