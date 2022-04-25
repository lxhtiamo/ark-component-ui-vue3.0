<template>
  <el-input-number v-model="text"
                   :clearable="disabled?false:clearable"
                   :controls-position="controlsPosition"
                   :disabled="disabled"
                   :label="placeholder?placeholder:`请输入${label}`"
                   :max="maxRows"
                   :min="minRows"
                   :precision="precision"
                   :readonly="readonly"
                   :size="size"
                   style="width: 100%"
                   @change="handleChange"
                   @click="handleClick"></el-input-number>
</template>

<script>
import create from '../utils/create';
import crudCompoents from '../mixins/crud-compoents.js';
import crudFun from '../mixins/crud-fun.js';

export default create({
  name: 'crud-input-number',
  mixins: [crudCompoents(), crudFun()],
  data() {
    return {};
  },
  props: {
    value: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    controlsPosition: {
      type: String,
      default: 'right'
    },
    precision: {
      type: Number,
      default: 0
    },
    minRows: {
      type: Number,
      default: -Infinity
    },
    maxRows: {
      type: Number,
      default: Infinity
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
});
</script>