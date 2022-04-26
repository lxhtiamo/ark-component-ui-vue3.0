<!--添加服务消息管理表列表-->
<template>
    <div class="dialog-tab-cnt" v-loading="loading">
        <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="info" style="padding-left: 50px;padding-right: 50px">
                <div style="height: calc(100% - 0px); overflow: auto;" class="formCircleStyle">
                    <el-form
                            ref="form"
                            :model="form"
                            label-width="180px" style="margin-right: 30px"
                            :rules="rules">
                        <el-row>
                                <el-col :span="12">
                                    <el-form-item label="标题" prop="title">
                                            <el-input v-model.trim="form.title" maxlength="255"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="消息类型" prop="type">
                                            <el-input v-model.trim="form.type" maxlength="4"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="服务主键" prop="relateUnid">
                                            <el-input v-model.trim="form.relateUnid" maxlength="32"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="已读标志" prop="readStatus">
                                            <el-input v-model.trim="form.readStatus" maxlength="2"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="创建时间" prop="createTime">
                                            <el-date-picker
                                                    v-model="form.createTime"
                                                    type="date"
                                                    placeholder="选择创建时间"
                                                    style="width: 100%"
                                                    format="yyyy-MM-dd"
                                                    value-format="yyyy-MM-dd HH:mm:ss"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="逻辑删除" prop="deleteFlag">
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="创建人标识" prop="createUnid">
                                            <el-input v-model.trim="form.createUnid" maxlength="32"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="创建人名称" prop="createName">
                                            <el-input v-model.trim="form.createName" maxlength="32"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="更新人标识" prop="updateUnid">
                                            <el-input v-model.trim="form.updateUnid" maxlength="32"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="更新名称" prop="updateName">
                                            <el-input v-model.trim="form.updateName" maxlength="32"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="消息发送对象主键" prop="sendUnid">
                                            <el-input v-model.trim="form.sendUnid" maxlength="32"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="消息发送对象名称" prop="sendName">
                                            <el-input v-model.trim="form.sendName" maxlength="32"/>
                                    </el-form-item>
                                </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import rules from "./rules";
    import {add, edit} from "@/api/abilityMessage";

    export default {
        name: "add",
        components: {},
        props: ['details', 'isEdit'],
        data() {
            return {
                activeName: 'info',
                loading: false,
                rules: rules,
                form: {
                    title: '',
                    type: '',
                    relateUnid: '',
                    readStatus: '',
                    createTime: '',
                    deleteFlag: '',
                    createUnid: '',
                    createName: '',
                    updateUnid: '',
                    updateName: '',
                    sendUnid: '',
                    sendName: '',
                },
            }
        },
        computed: {},
        watch: {},
        created() {

        },
        mounted() {
            this.setData();
        },
        beforeUnmount() {

        },
        unmounted() {

        },
        methods: {
            onCloseloading() { //关闭loading
                this.$emit("onCloseLoading");
            },
            setData() {
                if (this.details && this.details.unid) {
                    // 设置修改页面数据回填
                    this.form.unid = this.details.unid;
                    this.form.title = this.details.title
                    this.form.type = this.details.type
                    this.form.relateUnid = this.details.relateUnid
                    this.form.readStatus = this.details.readStatus
                    this.form.createTime = this.details.createTime
                    this.form.deleteFlag = this.details.deleteFlag
                    this.form.createUnid = this.details.createUnid
                    this.form.createName = this.details.createName
                    this.form.updateUnid = this.details.updateUnid
                    this.form.updateName = this.details.updateName
                    this.form.sendUnid = this.details.sendUnid
                    this.form.sendName = this.details.sendName
                } else {
                    // 设置新增时页面数据回填
                }
            },
            onClose() {
                //关闭
                this.$emit("closeDialog");
            },
            onSubmit(formName) {
                //保存
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        //规则正确
                        this.submitData();
                    } else {
                        this.$message.warning("信息填写错误,请检查!");
                        this.onCloseloading();
                        return false;
                    }
                });
            },
            submitData() {
                //提交数据
                this.loading = true;
                let api;
                if (this.isEdit) {
                    api = edit(this.form);
                } else {
                    api = add(this.form);
                }
                api.then(res => {
                    this.loading = false;
                    this.onCloseloading();
                    if (res.data.code == 200) {
                        this.$emit("closeDialog", "refresh");
                    }
                }).catch(e => {
                    console.log(e);
                    this.onCloseloading();
                    this.loading = false;
                });
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>
