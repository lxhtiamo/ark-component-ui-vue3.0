<template>
  <div v-if="show" style="height:100%;">
    <div class="search">
      <el-button icon="plus" type="primary" @click="addOrUpdate">新增</el-button>
    </div>
    <el-table :data="data" :header-cell-style="{background: '#F5F6F8'}" highlight-current-row>
      <template v-slot:empty>
        暂无数据
      </template>
      <el-table-column label="序号" type="index" width="100">
        <template v-slot="scope">
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username" width="120">
      </el-table-column>
      <el-table-column label="类型" prop="ype" width="80">
        <template v-slot="scope">
          <span>{{ scope.row.type == 1 ? "后端" : "前端" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="starts" prop="starts" width="150">
        <template v-slot="scope">
          <a :href="scope.row.git" target="_blank">
            <img :src="scope.row.stars" alt="star"/>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="码云" prop="address"></el-table-column>
      <el-table-column label="介绍" prop="info"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="small" type="text" @click="addOrUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update
        ref="addOrUpdate"
        @saveOrUpdate="saveOrUpdate">
    </add-or-update>
    <iframe frameborder="0" scrolling="no" src="https://element-plus.org/zh-CN/component/form.html"
            style="height: 800px;width: 100%;overflow: hidden"/>
  </div>
</template>
<script>
import {getStore} from "@/util/store.js";
import addOrUpdate from "./form/addOrUpdate";

export default {
  name: "wel",
  components: {
    addOrUpdate,
  },
  data() {
    return {
      drawer: true,
      page: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 15],
        total: 0,
      },
      data: [
        {
          unid: 1,
          username: "lengleng",
          name: "lengleng",
          number: 12,
          type: "0",
          stars: "https://gitee.com/log4j/pig/badge/star.svg?theme=white",
          git: "https://gitee.com/log4j/pig",
          address: "https://gitee.com/log4j",
          info:
              "Pig是基于Spring Cloud、OAuth2.0，使用Vue前后分离的开发平台,支持账号、 短信、 SSO等多种登录。 ",
        },
        {
          unid: 2,
          username: "smallwei",
          name: "smallwei",
          number: 20,
          type: "1",
          stars:
              "https://gitee.com/smallweigit/avue/badge/star.svg?theme=white",
          git: "https://gitee.com/smallweigit/avue",
          address: "https://gitee.com/smallweigit",
          info:
              "Avue是一个后台集成解决方案，它基于 Vue.js 和 element。 使用了最新的前端技术栈，支持权限验证，第三方网站嵌套等功能。",
        },
      ],
      easyDataOption2: {
        // color: 'rgb(63, 161, 255)',
        span: 6,
        discount: true,
        data: [
          {
            title: "错误日志",
            icon: "icon-cuowu",
          },
          {
            title: "数据展示",
            icon: "icon-shujuzhanshi2",
          },
          {
            title: "权限管理",
            icon: "icon-jiaoseguanli",
          },
          {
            title: "菜单管理",
            icon: "icon-caidanguanli",
          },
        ],
      },
      easyDataOption: {
        data: [
          {
            title: "错误日志",
            count: 12332,
            icon: "icon-cuowu",
            color: "rgb(49, 180, 141)",
          },
          {
            title: "数据展示",
            count: 33,
            icon: "icon-shujuzhanshi2",
            color: "rgb(56, 161, 242)",
          },
          {
            title: "权限管理",
            count: 2223,
            icon: "icon-jiaoseguanli",
            color: "rgb(117, 56, 199)",
          },
        ],
      },
    };
  },
  computed: {
    show() {
      const routeHash = getStore({name: "routeHash"});
      if (routeHash) {
        return false;
      }
      return true;
    },
  },
  created() {
  },
  methods: {
    addOrUpdate(row) {
      if (row) {
        // 编辑
        this.$refs.addOrUpdate.setTrue(row);
      } else {
        // 新增
        this.$refs.addOrUpdate.setTrue();
      }
    },
    saveOrUpdate(form) {
      if (!form.unid) {
        // 请求接口
        form.unid = this.uuid();
        this.data.push({...form});
      } else {
        this.data.forEach((da) => {
          if (da.unid == form.unid) {
            da = Object.assign(da, form);
          }
        });
      }
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    deleteRow(row) {
      this.$confirm("是否要删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 发送删除请求
        this.data = this.data.filter((item) => item.unid != row.unid);
      });
    },
  },
};
</script>

<style lang="scss" scoped="scoped">
.search {
  padding: 10px 0;
}

.info {
  padding: 21px 0;

  .img-border {
    width: 64px;
    height: 65px;
    position: relative;
    vertical-align: middle;
    display: inline-block;
  }

  .img-v {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 22px;
    height: 22px;
  }

  .img {
    border-radius: 5px;
    width: 64px;
    height: 64px;
    display: inline-block;
    overflow: hidden;

    img {
      display: block;
      max-width: none;
      height: 64px;
      opacity: 1;
      width: 64px;
      margin-left: 0px;
      margin-top: 0px;
    }
  }

  .user {
    margin-left: 20px;
    display: inline-block;
    color: rgb(153, 153, 153);
    vertical-align: middle;
  }

  .user-title {
    font-size: 18px;
    color: rgb(102, 102, 102);
    margin-right: 5px;
    display: inline-block;
    max-width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .user-subtitle {
    display: inline-block;
    width: 40px;
    height: 16px;
    line-height: 16px;
    border-radius: 2px;
    padding: 0px 5px;
    margin-left: 10px;
    font-size: 12px;
    text-align: center;
    color: rgb(255, 44, 84);
    background-color: rgb(255, 242, 244);
    white-space: nowrap;
  }

  .user-item {
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
