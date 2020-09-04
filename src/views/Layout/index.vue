<template>
    <div>
        <LayoutHeader />
        <LayoutMain />
        <LayoutNav />
    </div>
</template>
<script>
//引入组件
import LayoutHeader from "./Components/Header";
import LayoutNav from "./Components/Nav";
import LayoutMain from "./Components/Main";
export default {
    name:"layout",
    components:{
        LayoutHeader,LayoutNav,LayoutMain
    },
    setup(){

    }
}
</script>
<style lang="scss" scoped>

</style>