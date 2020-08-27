<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{current:item.current}"
          @click="toggleMenu(item)"
        >{{item.text}}</li>
      </ul>
      <!--表单验证-->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for>密码</label>
          <el-input
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="repassword" class="item-form" v-show="model === 'register'">
          <label for>重复密码</label>
          <el-input
            type="text"
            v-model="ruleForm.repassword"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="item-btn">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="item-btn mt-19">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate";
export default {
  name: "login",
  setup(props, { refs }) {
    //这里面放data数据，生命周期，自定义函数
    //reactive 遇到声明的数据是对象类型(直接取) ref遇到声明的数据是基础类型(取值的话需要加个value)
    //isRef 判端是否是基础数据类型console.log(isRef(model) ? true :false)  toRefs将reactive转换为普通对象
    /**
     *  const obj = reactive({
          x:0
        })
        const a = toRefs(obj);
        console.log(a.x.value)
     */
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      ruleForm.username = stripscript(value);
      value = ruleForm.username;
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      //过滤特殊字符
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validateRepassword = (rule, value, callback) => {
      //如果model的值为：login,直接通过
      if (model.value === "login") {
        callback();
      }
      //过滤特殊字符
      ruleForm.repassword = stripscript(value);
      value = ruleForm.repassword;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    //验证验证码
    let validateCode = (rule, value, callback) => {
      //过滤特殊字符
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (value == "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    //声明数据 表单绑定数据
    const ruleForm = reactive({
      username: "",
      password: "",
      repassword: "",
      code: ""
    });
    //表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      repassword: [{ validator: validateRepassword, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    const menuTab = reactive([
      { text: "登录", current: true, type: "login" },
      { text: "注册", current: false, type: "register" }
    ]);
    const model = ref("login");
    /**
     * 声明函数
     */
    const toggleMenu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      data.current = true;
      model.value = data.type;
    };
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 生命周期
     */
    //挂载完成后
    onMounted(() => {});
    return {
      menuTab,
      model,
      ruleForm,
      rules,
      toggleMenu,
      submitForm
    };
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>