<!--服务消息管理表-->
<template>
    <el-container class="el-contain-div">
        <el-header class="topParentHeader">
            <publicSubTop :title="title">
              <template v-slot:right>
                <div v-if="pageType==2" style="text-align:center;width: 100%">
                    <el-button type="primary" @click="onSubmit('form')" :loading="loadingBTN">保 存</el-button>
                    <el-button @click="onClose">关 闭</el-button>
                </div>
                <el-button v-if="pageType==3" @click="comeBack">返 回</el-button>
              </template>
            </publicSubTop>

        </el-header>
        <el-main v-show="pageType==1">
            <list ref="list" @goIndexPage="goIndexPage"></list>
        </el-main>
        <el-main v-if="pageType==2">
            <add ref="add" v-on:closeDialog="closeDialog" :details="itemData" @onCloseLoading="onCloseLoading" :isEdit="isEdit"></add>
        </el-main>
        <el-main v-if="pageType==3">
            <detail :itemData="itemData" ref="detail"></detail>
        </el-main>
    </el-container>
</template>

<script>
    import publicSubTop from '@/public/publicSubTop'
    import list from './list'
    import add from './add'
    import detail from './detail'

    const title1 = '服务消息管理表';
    const title2 = '新增服务消息管理表';
    const title2_1 = '修改服务消息管理表';
    const title3 = '查看服务消息管理表';
    export default {
        name: "index",
        components: {list, add, detail, publicSubTop},
        props: [],
        data() {
            return {
                pageType: '1',//1：列表, 2：编辑, 3：详情
                title: title1,
                itemData: "",
                isEdit: false,
                loadingBTN: false
            }
        },
        computed: {},
        watch: {
            pageType(n, o) {
                this.setTitle(n)
            }
        },
        created() {
        },
        mounted() {
        },
        beforeUnmount() {
        },
        unmounted() {
        },
        methods: {
            onCloseLoading() {
                this.loadingBTN = false;
            },
            closeDialog(data) {//提交成功关闭添加的dialog
                if (data) {  //重新的标记
                    this.$refs.list.setParameter();
                }
                this.pageType = "1";
            },
            comeBack() {
                this.onClose();
            },
            onClose() { //关闭
                this.pageType = '1';
                this.onCloseLoading();
            },
            /*新增或编辑或查看的*/
            goIndexPage(data) {
                this.itemData = data.itemData;
                this.isEdit = data.isEdit;
                if (data) {
                    this.pageType = data.pageType;
                }
            },
            setTitle(pageType) {
                if (pageType == '1') {
                    this.title = title1;
                } else if (pageType == '2') {
                    if (this.isEdit) {
                        this.title = title2_1;
                    } else {
                        this.title = title2;
                    }
                } else if (pageType == '3') {
                    this.title = title3;
                }
            },
            onSubmit(formName) {
                this.loadingBTN = true;
                this.$refs.add.onSubmit(formName);
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>
