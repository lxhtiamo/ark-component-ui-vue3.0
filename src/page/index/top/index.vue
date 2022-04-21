<template>
    <div class="avue-top">
        <div class="top-bar__left" style="display: flex">
            <!--v-if="showCollapse"-->
            <div class="avue-breadcrumb">
                <i class="icon-navicon avue-breadcrumb_collapse"
                   :class="[{ 'avue-breadcrumb_collapse--right': isCollapse }]"
                   @click="setCollapse"></i>
            </div>
            <div style="display: flex;align-items:center;justify-content: center;">
                <el-divider direction="vertical"></el-divider>
                <el-breadcrumb separator-icon="ArrowRight"
                    style="margin-left: 5px">
                    <el-breadcrumb-item>当前位置：</el-breadcrumb-item>
                    <el-breadcrumb-item
                        :to="getBreadcrumbPath(item)"
                        v-for="(item, index) in titleList"
                        :key="index"
                    >{{ item.name }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="top-bar__right">
            <el-dropdown trigger="click">
                <img
                    src="/img/icon/settings.png"
                    class="imgs"
                    style="margin-right: 10px"
                />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="toDialog">关于系统</el-dropdown-item>
                    </el-dropdown-menu>
                </template>

            </el-dropdown>
            <el-dropdown>
        <span class="el-dropdown-link" style="display: flex;align-items: center;cursor: pointer">
         {{ userInfo.orgNames }}&nbsp; &nbsp;{{ userInfo.userName }}
         <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出系统</el-dropdown-item>
                    </el-dropdown-menu>
                </template>

            </el-dropdown>

        </div>
        <el-dialog
            title="关于系统"
            v-model="dialogVisible"
            width="30%"
            :modal="false"
            append-to-body
            custom-class="about-settings">
            <div class="about-sys-logo">
                <img src="img/icon/logo.png"/>
                <h4>基础</h4>
                <p style="color: #2f4555">当前版本号:{{ website.sysVersion }}</p>
            </div>
            <div class="about-sys-content">
                <h4>{{ website.sysVersion }}更新内容：</h4>
                <div v-for="(item,i) in website.changeLog" :key="i">
                    {{ item }}
                </div>
                <h4>授权过期时间：</h4>
                <div>{{ licenseInformation && licenseInformation.expireDate ? licenseInformation.expireDate : '' }}</div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapState} from "vuex";
import {
    fullscreenToggel,
    getRedirectUri,
    listenfullscreen,
} from "@/util/util";
import {casUrl, casLoginType} from '@/config/env';
import {getStore} from '@/util/store';
import {getLicenseInfo} from "@/api/user";
export default {
    components: {},
    name: "top",
    props: {
        titleList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            dialogVisible: false,
            licenseInformation: null
        };
    },
    filters: {},
    created() {
        this.getLicenseInfo();
    },
    mounted() {
        listenfullscreen(this.setScreen);
    },
    computed: {
        ...mapState({
            showDebug: (state) => state.common.showDebug,
            showColor: (state) => state.common.showColor,
            showTheme: (state) => state.common.showTheme,
            showLock: (state) => state.common.showLock,
            showFullScren: (state) => state.common.showFullScren,
            showCollapse: (state) => state.common.showCollapse,
            showSearch: (state) => state.common.showSearch,
            showMenu: (state) => state.common.showMenu,
        }),
        ...mapGetters([
            "userInfo",
            "isFullScren",
            "tagWel",
            "tagList",
            "isCollapse",
            "tag",
            "logsLen",
            "logsFlag", 'website'
        ]),
    },
    methods: {
        toDialog() {
            this.dialogVisible = true;
        },
        getBreadcrumbPath(item) {
            if (item.type == 1) {
                return "";
            } else {
                return {path: item.path};
            }
        },
        handleScreen() {
            fullscreenToggel();
        },
        setCollapse() {
            this.$store.commit("SET_COLLAPSE");
        },
        setScreen() {
            this.$store.commit("SET_FULLSCREN");
        },
        logout() {
            this.$confirm("是否退出系统, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.$store.dispatch("LogOut").then(() => {
                    let redirect_uri = getRedirectUri(window.location);
                    let url = '';
                    if (casLoginType == 'portalwork') {
                        url = casUrl + "/logout?userUnid=" + this.userInfo.id + "&service=" + redirect_uri;
                    } else {
                        let extras = getStore({name: 'extras'});
                        url = casUrl + "/notice/logout?redirect_uri=" + redirect_uri + "&app_id=" + extras.appId + "&access_token=" + extras.accessToken;
                    }
                    location.replace(url);
                });
            });
        },
        getLicenseInfo() {
            getLicenseInfo().then(res => {
                this.licenseInformation = res.data.data
            })
        },
    },
};
</script>

<style lang="scss">
.about-settings {
    width: 520px;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #b4b4b4;

    .el-dialog__header {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
        padding: 0 0 0 24px;
        border-bottom: 1px solid #e5e8eb;

        .el-dialog__title {
            color: #2f4555;
        }
    }

    .el-dialog__body {
        padding: 0 24px !important;
    }

    .about-sys-logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 168px;
        margin: 32px 0 0;

        & > img {
            width: 60px;
            height: 60px;
        }

        & > h4 {
            font-size: 24px;
            color: #2f4555;
        }
    }

    .about-sys-content {
        overflow: hidden;
        padding-bottom: 32px;

        & p {
            color: #2f4555;
            word-wrap: break-word;
            white-space: normal;
            line-height: 28px;
        }

        & > h4 {
            color: #2f4555;
        }
    }

    .el-dialog__body {
        padding: 0;
    }
}

.drop-out {
    top: 32px !important;
}
</style>
<style lang="scss" scoped>
.el-dropdown {
    .imgs {
        vertical-align: middle;
        cursor: pointer;
    }
}
</style>

