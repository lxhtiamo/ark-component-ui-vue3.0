<!--<comment>
    # 地区级联 公用  选择范围是全国地区单选
</comment>-->
<template>
  <div style="width: 100%;height: 100%">
    <el-cascader
        :show-all-levels="showAllLevels"
        style="width: 100%;"
        :class="(MyValues.length>0||!placeholder.includes('请'))?'elInputDemo':'elInputDemo_def'"
        v-model="MyValues"
        :options="options"
        areaLevel=""
        :placeholder="placeholder"
        :props="cascaderProps"
        @change="change"
        ref="areaCascader"
        clearable>
    </el-cascader>
  </div>
</template>

<script>
import * as util from '@/util/util.js';
import {findOrgList} from '@/api/deptApi'
import {isEmpty} from "../util/util";

export default {
  name: "publicCascader",
  components: {},
  props: {
    //区域等级 <= 本节点node的standard时候不请求 用于拦截 区划不加载数据
    areaLevelFrom: {
      type: Number,
      default: -1,
    },
    content: {  //展示值
      type: String,
      default: '请选择'
    },
    isSingle: { //是否不限制单选,true任意节点都可以选  false只能选子节点
      type: Boolean,
      default: true
    },
    type: { //接口类型选择
      type: String,
      default: ''
    },
    isFrist: { //是否默认选中第一项 //默认不选中
      type: Boolean,
      default: false
    },
    /*:show-all-levels="false" 属性show-all-levels定义了是否显示完整的路径，将其赋值为false则仅显示最后一级*/
    showAllLevels: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let self = this;
    return {
      isbeTheFirstChoice: this.isFrist ? this.isFrist : false,
      MyValues: [],
      options: [],
      optionsTemp: [],
      placeholder: this.content ? this.content : '请选择',
      deptType: this.type ? this.type : '',//机构性质 1 区域  2 部门  3 虚拟
      cascaderProps: {
        value: 'id',
        label: 'name',
        checkStrictly: this.isSingle,
        lazy: true,
        leaf: 'isLeaf',
        children: 'children',
        lazyLoad(node, resolve) {
          if (node && node.data) {
            self.getTreeNode(node, resolve);
          }
        }
      },
    }
  },
  computed: {},
  watch: {
    content(N, O) {
      this.setPlaceholder(N);
    }
  },
  created() {
    this.getDeptTreeData();
  },
  mounted() {

  },
  methods: {
    cleanVal() {
      this.MyValues = [];
    },
    setPlaceholder(Str) {
      if (!util.isEmpty(Str)) {
        this.placeholder = Str;
      } else {
        this.placeholder = '请选择';
      }
    },
    /*获取部门树*/
    getDeptTreeData() {
      findOrgList({
        deptType: this.deptType,
        punid: "",
      })
          .then(res => {
            this.options = res.data.data;
            this.optionsTemp = [];
            this.optionsTemp.push(...res.data.data);
            if (this.isbeTheFirstChoice) {
              this.MyValues.push(res.data.data[0].id);
              this.emitNode(res.data.data[0]);
            }
          }).catch(e => {
        console.log(e)
      });
    },
    /*别级联的回调*/
    change(val) {
      if (Array.isArray(val) && val.length > 0) {
        this.sendData = [];
        for (let nodeItem of this.optionsTemp) {
          for (let [index, subitem] of val.entries()) {
            if (index == val.length - 1) {  //[因为返回的数据是[1,2,3]  最后一位才是选中的节点 前面是各级所在的父级]
              if (subitem == nodeItem.id) {
                /*选中的节点*/
                this.emitNode(nodeItem);
              }
            }
          }
        }
      } else {
        this.$emit('getNodeData');
        // this.placeholder = "请选择地区";
      }
      this.$refs.areaCascader.dropDownVisible = false; //监听值发生变化就关闭它 //记住他这个属性我找了好久
    },

    /*懒加载下级数据*/
    getTreeNode(node, resolve) {
      /*限制区域等级的加载,用于限制某个区域等级的地区树不加载.....如限制到市级 ,如福州市是3 ,则福州市下面的区县等级大于3的就不加载,*/
      if (this.areaLevelFrom != -1 && this.areaLevelFrom <= node.data.standard) {
        resolve(null);
      } else if (this.areaLevelFrom == -1) {
        findOrgList({
          punid: node.data.id,
          nature: this.deptType, //机构性质 1 区域  2 部门  3 虚拟
        }).then(res => {
          resolve(res.data.data);
          if (res.data.data) {
            this.optionsTemp.push(...res.data.data);
          }
          if (!this.isSingle) {//直选最后一级.懒加载最后一级是空的就把他选上去
            if (!res.data.data && node.data) {
              this.MyValues = node.path;
              this.change(node.path);
            }
          }
        }).catch(e => {
          console.log(e)
        });
      } else {
        findOrgList({
          punid: node.data.id,
          deptType: this.deptType, //机构性质 1 区域  2 部门  3 虚拟
        }).then(res => {
          resolve(res.data.data);
          this.optionsTemp.push(...res.data.data);
        }).catch(e => {
          console.log(e)
        });
      }

    },
    /*回调选中的节点*/
    emitNode(data) {
      this.$emit('getNodeData', data, this.MyValues)
    },
    /*获取所有加载的缓存起来的节点集合*/
    getNodeList() {
      this.$emit('getNodeList', this.optionsTemp);
    },
    /*根据父id从缓存的列表中获取上级的父节点信息*/
    getNodeParent(parentId) {
      return this.optionsTemp.find(item => item.id == parentId);
    }
  },
}
</script>

<style lang="scss">

/*输入框提示颜色*/
.elInputDemo {
  .el-input {
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #666 !important;
    }

    input:-moz-placeholder, textarea:-moz-placeholder {
      color: #666 !important;
    }

    input::-moz-placeholder, textarea::-moz-placeholder {
      color: #666 !important;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #666 !important;
    }
  }

  .el-textarea {
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #666;
    }

    input:-moz-placeholder, textarea:-moz-placeholder {
      color: #666;
    }

    input::-moz-placeholder, textarea::-moz-placeholder {
      color: #666;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #666;
    }
  }
}

/*输入框提示颜色默认*/
.elInputDemo_def {
  .el-input {
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #C4C4CC !important;
    }

    input:-moz-placeholder, textarea:-moz-placeholder {
      color: #C4C4CC !important;
    }

    input::-moz-placeholder, textarea::-moz-placeholder {
      color: #C4C4CC !important;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #C4C4CC !important;
    }
  }

  .el-textarea {
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #C4C4CC;
    }

    input:-moz-placeholder, textarea:-moz-placeholder {
      color: #C4C4CC;
    }

    input::-moz-placeholder, textarea::-moz-placeholder {
      color: #C4C4CC;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #C4C4CC;
    }
  }
}

</style>