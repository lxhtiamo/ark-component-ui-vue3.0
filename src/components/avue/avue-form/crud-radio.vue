<template>
  <el-radio-group v-model="text"
                  :disabled="disabled"
                  @change="handleChange"
                  @click="handleClick">
    <el-radio v-for="(item,index) in dic"
              :key="index"
              :border="border"
              :disabled="item[disabledKey]"
              :label="item[valueKey]"
              :readonly="readonly">{{ item[labelKey] }}
    </el-radio>
  </el-radio-group>
</template>

<script>
import create from '../utils/create';
import crudCompoents from '../mixins/crud-compoents.js';
import crudFun from '../mixins/crud-fun.js';

export default create({
  name: 'crud-radio',
  mixins: [crudCompoents(), crudFun()],
  data() {
    return {};
  },
  props: {
    value: {}
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
});
</script>