<template>
  <div class="avue-tags"
       v-if="showTag">
    <!-- tag盒子 -->
    <div class="avue-tags__box"
         :class="{'avue-tags__box--close':!website.isFirstPage}">
      <el-tabs v-model="active"
               type="card"
               :closable="tagLen!==1"
               @tab-click="openTag"
               @edit="menuTag">
        <el-tab-pane :key="item.value"
                     v-for="item in tagList"
                     :label="item.label"
                     :name="item.value">
        </el-tab-pane>
      </el-tabs>
      <el-dropdown class="avue-tags__menu">
        <el-button type="primary"
                   size="mini">
          更多
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="closeOthersTags">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTags">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>
<script>
    import {mapGetters, mapState} from 'vuex'
    import {getStore} from '@/util/store'

    const BREADCRUMB_TYPE = {
        //非菜单(未端节点)
        NOT_MENU: 0,
        //菜单节点，且有子菜单
        MENU_HAS_CHILD: 1,
        //菜单节点，无子菜单(可点击)
        MENU_NO_CHILD: 2,
    };
    export default {
        name: 'tags',
        data() {
            return {
                active: '',
                positionStack: [],   //当前位置的栈
            }
        },
        created() {
        },
        mounted() {
            this.setActive();
        },
        watch: {
            tag() {
                this.setActive();
            },
            menu() {
                this.setActive();
            }
        },
        computed: {
            ...mapGetters(['tagWel', 'tagList', 'tag', 'website', "menu"]),
            ...mapState({
                showTag: state => state.common.showTag,
            }),
            tagLen() {
                return this.tagList.length || 0;
            }
        },
        methods: {
            //激活当前选项
            setActive() {
                this.active = this.tag.value;
                let menu = getStore({name: 'menu'});
                if (!menu) {
                    return
                }
                if (menu.length == 0) {
                    return
                }
                let position = [];
                this.getPosition(menu, position);
                if (position.length == 0) {
                    //未匹配到菜单，
                    this.popPositionStack();
                    this.pushPositionStack();
                } else {
                    position.reverse();
                    this.positionStack = position;
                }
                this.$emit('changeTitle', this.positionStack);
            },
            //****************************************************面包屑处理
            getPosition(content, position) {
                for (let item of content) {
                    if (this.active == item.path) {
                        let obj = {
                            path: item.path,
                            name: item.label,
                            type: this.getPositionType(item),
                        }
                        position.push(obj);
                        return;
                    } else {
                        this.getPosition(item.children, position);
                        if (position && position.length > 0) {
                            let obj = {
                                path: item.path,
                                name: item.label,
                                type: this.getPositionType(item),
                            }
                            position.push(obj);
                            return;
                        }
                    }
                }
                return position;
            },
            getPositionType(item) {
                let type = BREADCRUMB_TYPE.MENU_NO_CHILD;
                if (item.children && item.children.length > 0) {
                    type = BREADCRUMB_TYPE.MENU_HAS_CHILD;
                }
                return type;
            },
            /**
             * 调整栈，将非菜单的节点弹出
             */
            popPositionStack() {
                if (this.positionStack && this.positionStack.length > 0) {
                    let top = this.positionStack[this.positionStack.length - 1];
                    while (top && top.type == BREADCRUMB_TYPE.NOT_MENU) {
                        this.positionStack.pop();
                        top = this.positionStack[this.positionStack.length - 1];
                    }
                }
            },
            /**
             * 将当前节点压入栈
             */
            pushPositionStack() {
                if (this.positionStack && this.positionStack.length == 0) {
                    let menu = getStore({name: 'menu'});
                    this.getParentPosition(menu, this.positionStack);
                }
                let obj = {
                    path: this.tag.value,
                    name: this.tag.label,
                    type: BREADCRUMB_TYPE.NOT_MENU,
                }
                this.positionStack.push(obj);
            },
            getParentPosition(content, position) {
                for (let item of content) {
                    if (this.active.startsWith(item.path)) {
                        let obj = {
                            path: item.path,
                            name: item.label,
                            type: this.getPositionType(item),
                        }
                        position.push(obj);
                        this.getParentPosition(item.children);
                        return;
                    }
                }
            },
            //****************************************
            menuTag(value, action) {
                if (action === 'remove') {
                    let {tag, key} = this.findTag(value);
                    this.$store.commit('DEL_TAG', tag)
                    if (tag.value === this.tag.value) {
                        tag = this.tagList[key === 0 ? key : key - 1] //如果关闭本标签让前推一个
                        this.openTag(tag)
                    }
                }
            },
            openTag(item) {
                let tag;
                if (item.name) {
                    tag = this.findTag(item.name).tag;
                } else {
                    tag = item;
                }
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: tag.label,
                        src: tag.value
                    }),
                    query: tag.query
                })
            },
            closeOthersTags() {
                this.$store.commit('DEL_TAG_OTHER')
            },
            findTag(value) {
                let tag, key;
                this.tagList.map((item, index) => {
                    if (item.value === value) {
                        tag = item;
                        key = index;
                    }
                });
                return {tag: tag, key: key};
            },
            closeAllTags() {
                this.$store.commit('DEL_ALL_TAG')
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        src: this.tagWel.value
                    }),
                    query: this.tagWel.query
                })
            },
        }
    }
</script>