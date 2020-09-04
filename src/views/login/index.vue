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
        ref="loginForm"
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
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="repassword" class="item-form" v-show="model === 'register'">
          <label for>重复密码</label>
          <el-input
            type="password"
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
              <el-button
                type="success"
                class="item-btn"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="item-btn mt-19"
            :disabled="loginButtonStatus"
          >{{model === 'login' ? "登录":"注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate";
export default {
  name: "login",
  setup(props, { refs, root }) {
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
      } else if (value != ruleForm.password) {
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
    //模块值
    const model = ref("login");
    //登录按钮禁用状态
    const loginButtonStatus = ref(true);
    //验证码按钮禁用状态
    // const codeButtonStatus = ref(false);
    // const codeButtonText = ref('获取验证码');
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    //倒计时
    const timer = ref(null);

    /**
     * 声明函数
     */
    //切换模块
    const toggleMenu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      data.current = true;
      model.value = data.type;
      resetFormData();
      clearCountDown();
    };
    //清除表单数据
    const resetFormData = () => {
      //重置表单
      refs.loginForm.resetFields();
    };
    //更新按钮的状态
    const updateButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    /**
     * 获取验证码
     */
    const getSms = () => {
      //提示信息
      if (ruleForm.username === "") {
        root.$message({
          showClose: true,
          message: "邮箱不能为空！！",
          type: "error"
        });
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message({
          showClose: true,
          message: "邮箱格式有误！",
          type: "error"
        });
        return false;
      }
      //修改验证码按钮状态
      updateButtonStatus({
        status: true,
        text: "发送中"
      });
      setTimeout(() => {
        //请求的接口
        GetSms({
          username: ruleForm.username,
          module: model.value
        })
          .then(response => {
            let data = response.data;
            root.$message({
              message: data.message,
              type: "success"
            });
            //启用登录或者注册按钮
            loginButtonStatus.value = false;
            //调用定时器，进行倒计时
            countDown(60);
          })
          .catch(error => {
            console.log(error);
          });
      }, 3000);
    };
    /**
     * 提交表单
     */
    const submitForm = formName => {
      //表单校验通过
      refs[formName].validate(valid => {
        if (valid) {
          if (model.value === "login") {
            login();
          } else {
            register();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 登录
     */
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      Login(requestData)
        .then(response => {
          console.log(response);
          //登录成功,页面跳转
          root.$router.push({
            name: "Console"
          });
        })
        .catch(error => {});
    };
    /**
     * 注册
     */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      //注册接口
      Register(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          toggleMenu(menuTab[0]);
          clearCountDown();
        })
        .catch(error => {});
    };
    /**
     * 倒计时
     */
    const countDown = number => {
      //判端定时器是否存在，存在则清除
      if (time_value) {
        clearInterval(timer.value);
      }
      let time_value = number;
      timer.value = setInterval(() => {
        time_value--;
        if (time_value == 0) {
          clearInterval(timer.value);
          updateButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time_value}秒`;
        }
      }, 1000);
    };
    /**
     * 清除倒计时
     */
    const clearCountDown = () => {
      //还原验证码默认状态
      updateButtonStatus({
        status: false,
        text: "获取验证码"
      });
      //清除倒计时
      clearInterval(timer.value);
    };
    /**
     * 生命周期
     */
    //挂载完成后
    onMounted(() => {
      // GetSms();
    });
    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      timer,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      clearCountDown,
      resetFormData,
      updateButtonStatus,
      getSms
    };
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>