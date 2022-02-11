import * as publicRule from "@/rules/rules.js";

export default {
  dictType: [
    {
      required: true,
      message: "请输入字典类型",
      trigger: "blur",
    },
    { required: true, trigger: "blur", validator: publicRule.enCnChar },
  ],
  dictName: [
    {
      required: true,
      message: "请输入字典显示值",
      trigger: "blur",
    },
    { required: true, trigger: "blur", validator: publicRule.enCnChar },
  ],
  dictValue: [
    {
      required: true,
      message: "请输入字典值",
      trigger: "blur",
    },
    { required: true, trigger: "blur", validator: publicRule.enCnChar },
  ],
  sortId: [
    {
      required: true,
      message: "请输入排序",
      trigger: "blur",
    },
    { required: true, trigger: "blur", validator: publicRule.enCnChar },
  ],
  dictStatus: [
    {
      required: true,
      message: "请选择类型",
      trigger: "change",
    },
  ],
};
