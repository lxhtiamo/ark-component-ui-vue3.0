<template>
  <div className="avue-logo">
    <transition name="fade">
      <span v-if="keyCollapse"
            key="0"
            class="avue-logo_subtitle">
        {{ website.logo }}
      </span>
    </transition>
    <img alt="" src="/img/icon/logo.png" style="padding: 5px">
    <transition-group name="fade">
      <template v-if="!keyCollapse">
        <span key="1"
              class="avue-logo_title">{{ website.indexTitle }} </span>
      </template>
    </transition-group>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "logo",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  created() {

  },
  computed: {
    ...mapGetters(["website", 'keyCollapse'])
  },
  methods: {}
};
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-active {
  transition: opacity 2.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 50px;
  line-height: 20px !important;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;

  &_title {
    //display: block;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    color: #274092;
  }

  &_subtitle {
    // display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
