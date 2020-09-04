<template>
  <div id="nav-wrap">
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <!--一级菜单-->
      <template v-for="(item,index) in routers">
        <!-- toString() or index+'' -->
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index.toString()">   
          <template slot="title">
           <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"/>
            <span slot="title">{{item.meta.name}}</span>
          </template>
          <!--子级菜单-->
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
          >{{subItem.meta.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
    <svg-icon iconClass="menu" className="menu" />
  </div>
</template>
<script>
import { ref, reactive } from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root }) {
    /**
     * data 数据
     */
    const isCollapse = ref(false);
    const routers = reactive(root.$router.options.routes);
    // console.log(routers);
    /**
     * 函数
     */
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    return {
      handleOpen,
      handleClose,
      isCollapse,
      routers
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./styles/Nav.scss";
</style>