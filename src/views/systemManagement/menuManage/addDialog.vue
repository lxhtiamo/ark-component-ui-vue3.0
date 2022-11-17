<template>
  <el-dialog :title="title" v-model="dialogFormVisible" :before-close="closedDialog"
             :close-on-click-modal="false">
    <el-form :model="formData" label-width="110px" :rules="rules" ref="addItemRef">
      <el-form-item label="资源类型" prop="resourceType">
        <el-radio-group v-model="formData.resourceType" @change="changeRadio">
          <el-radio :label=0>菜单</el-radio>
          <el-radio :label=1>按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="formData.resourceType==1?'按钮名称':'菜单名称'" prop="name">
        <el-input v-model.trim="formData.name" :placeholder="formData.resourceType==1?'请输入按钮名称':'请输入菜单名称'"
                  maxlength="100"></el-input>
      </el-form-item>

      <el-form-item label="上级菜单" prop="punid">
        <el-cascader
            ref="supRef"
            filterable
            @change="cascaderChange"
            v-model="formData.superiorResources"
            :options="superiorResourcesList"
            :props="{ checkStrictly: true }"
            clearable></el-cascader>
      </el-form-item>

      <el-form-item label="默认图片路径" prop="iconPath">
        <el-input v-model.trim="formData.iconPath" placeholder="请输入默认图片路径" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="悬停图片路径" prop="dynamicImg">
        <el-input v-model.trim="formData.dynamicImg" placeholder="请输入悬停图片路径" maxlength="100"></el-input>
      </el-form-item>

      <el-form-item label="排序号" prop="sort">
        <el-input-number placeholder="请输入排序号" v-model="formData.sort" :min="0"
                         style="width:210px" :max="999" controls-position="right"/>
      </el-form-item>

      <el-form-item label="URL" prop="url">
        <el-input v-model.trim="formData.url" placeholder="请输入url" maxlength="100"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">启用</el-radio>
          <el-radio label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <template v-slot:footer>
      <div>
        <el-button @click="closed()">关闭</el-button>
        <el-button type="primary" :loading="loading" @click="submitData">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {menu_addItem, menu_editItem, menu_detail, menu_findPage} from '@/api/systemManageApi'
import {passHtmlAndSql} from "@/rules/rules"
import {deepClone} from "../../../util/util";
import * as publicRule from "../../../rules/rules";


export default {
  name: "addDialog",
  components: {},
  props: {
    item: {
      type: Object,
      default: null,
    }
  },
  data() {
    let self = this;
    return {
      title: '添加系统菜单',
      dialogFormVisible: true,
      formData: {
        name: '',
        iconPath: '',
        sort: undefined,
        status: '0',
        url: '',
        punid: '',
        superiorResources: [],
        dynamicImg: '',
        resourceType: null,
      },

      loading: false,
      superiorResourcesList: [],
    }
  },
  watch: {
    'formData.resourceType': {
      handler(newval, oldval) {
        if (newval == 1) {
          this.rules.name[0].message = '请输入按钮名称';
        } else {
          this.rules.name[0].message = '请输入菜单名称';
        }
      },
    }
  },
  computed: {
    /*表单的验证信息中的国际化必须这样放在计算属性中,要不然切换语言就不生效*/
    rules() {
      return {
        name: [
          {required: true, trigger: 'blur', message: '请输入按钮名称'},
          {validator: passHtmlAndSql, trigger: "blur"}
        ],
        punid: [{required: true, trigger: 'change', message: '请选择上级菜单'}],
        iconPath: [{
          required: false, trigger: 'blur', validator(r, v, c) {
            if (v) {
              passHtmlAndSql(r, v, c)
            } else {
              c();
            }
          }
        }],
        dynamicImg: [{
          required: false, trigger: 'blur', validator(r, v, c) {
            if (v) {
              passHtmlAndSql(r, v, c)
            } else {
              c();
            }
          }
        }],
        sort: [{required: true, trigger: 'blur', message: '请输入排序号',type: 'number'}],
        url: [{required: true, trigger: 'blur', message: '请输入URL'}],
        status: [{required: true, trigger: 'change', message: '请选择状态'}],
        resourceType: [{required: true, trigger: 'change', message: '请选择资源类型'}],
      };
    }
  },
  mounted() {
    if (this.item) {
      this.title = '编辑系统菜单';
      Promise.all([this.getMenuList(), this.getDetail()])
          .then(() => {
            if (this.superiorResourcesList) {
              this.formData.superiorResources = [];
              this.getList(this.formData.punid, this.superiorResourcesList, [])
              this.$forceUpdate()
            }
          })
    } else {
      this.title = '添加系统菜单';
      this.getMenuList();
    }
  },
  methods: {
    changeRadio(val) {
      this.$refs.addItemRef.validateField('name');
    },
    closedDialog() {
      this.closed();
    },
    submitData() {
      let netWork = ''
      this.$util.isValidate(this, 'addItemRef').then(res => {
        if (res) {
          if (this.formData.unid) {
            netWork = menu_editItem
          } else {
            netWork = menu_addItem;
          }
          this.loading = true;
          netWork(this.formData).then(() => {
            this.$util.showMessage('操作成功', '1')
            this.closed(true)
          }).catch(err => {
            this.$util.showMessage(err);
          }).finally(() => {
            this.loading = false;
          })
        }
      });
    },
    closed(obj) {
      this.$emit('closed', obj)
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        menu_detail({unid: this.item.unid})
            .then(res => {
              this.formData = res.data.data || {};
              resolve(res)
            })
            .catch(err => {
              this.$util.showMessage(err)
              reject(err)
            })
      })

    },
    getMenuList() {
      return new Promise((resolve, reject) => {
        this.superiorResourcesList = [{value: '0', label: '/'}];
        menu_findPage({size: 90, current: 1, resourceType: 0, status: 0})
            .then(res => {
              let data = res.data.data;
              this.setList(data, 0, false);
              if (data) {
                this.superiorResourcesList.push(...data)
              }
              resolve(data)
            })
            .catch(err => {
              this.$util.showMessage(err)
              reject(err);
            })
      })
    },
    cascaderChange() {
      this.$refs.supRef.dropDownVisible = false;
      if (this.formData.superiorResources && this.formData.superiorResources.length == 0) {
        this.formData.punid = '';
      } else if (this.formData.superiorResources && this.formData.superiorResources.length > 0) {
        this.formData.punid = this.formData.superiorResources[this.formData.superiorResources.length - 1];
      }
    },
    setList(list, level, disabled, parentObj) {
      list.forEach(obj => {
        obj.value = obj.unid;
        obj.label = obj.name;
        if (level >= 2) {
          obj.disabled = false;
        } else {
          obj.disabled = false;
        }
        if (this.item && this.item.unid == obj.unid) {
          obj.disabled = true;
        }
        if (disabled) {
          obj.disabled = disabled
        }
        if (!obj.fullUnid) {//保存一个树形结构的全路径unid
          obj.fullUnid = [];
        }
        /*存在父级,就存入父级的unid,在并把自己存进去,这就形成了[xxx.xxx]的结构.没有父级就把自己当前unid存进去传给下一子级*/
        if (parentObj && parentObj.fullUnid && Array.isArray(parentObj.fullUnid) && parentObj.fullUnid.length > 0) {
          obj.fullUnid.push(...parentObj.fullUnid);
          obj.fullUnid.push(obj.unid);
        } else {
          obj.fullUnid.push(obj.unid);
        }
        if (obj.childrenList && obj.childrenList.length > 0) {
          obj.children = obj.childrenList;
          let index = level + 1;
          this.setList(obj.children, index, obj.disabled, obj)//把父级传到子级循环中去
        }
      })
    },
    getList(unid, list, dataList) {
      list.forEach(obj => {
        if (unid == obj.value) {//这里的unid是formData.punid
          if (obj.fullUnid && Array.isArray(obj.fullUnid) && obj.fullUnid.length > 0) {
            dataList.push(...obj.fullUnid)
          } else {
            dataList.push(obj.value)
          }
          this.formData.superiorResources = deepClone(dataList);
        } else if (unid != obj.value && obj.children && obj.children.length > 0) {
          this.getList(unid, obj.children, dataList);
        }
      })
    },
    getImg(imgUnid) {
      this.formData.iconPath = imgUnid;
    }
  },
}
</script>

<style scoped>

</style>