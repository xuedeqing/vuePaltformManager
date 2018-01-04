<template lang="html">
  <div class="login">
    <div class="loginbox">
      <div class="logobox">
        <!-- <img  class="logoimg" src="../../assets/img/login_logo.png" alt=""> -->
      </div>
      <div class="inputbox bz-bb">
        <p class="title">登录 &nbsp;/&nbsp; Login </p>
        <!-- element样式 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
          <div prop="username" class="eachinput nameinput">
          <input  class="inp" v-model="ruleForm.username" type="text" name="" value="" placeholder="用户名">
        </div>
        <div  prop="password" class="eachinput pswinput">
          <input type="password" name="" value="" placeholder="密码"  v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
        </div>
           <!-- <el-form-item prop="username">
               <el-input v-model="ruleForm.username" placeholder="用户名" class="eachinput nameinput"></el-input>
           </el-form-item>

           <el-form-item prop="password">
               <el-input type="password" placeholder="password" class="eachinput pswinput" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
           </el-form-item> -->
           <div class="login-btn">
               <el-button type="primary" @click="submitForm('ruleForm')" class='loginbtn'>登录</el-button>
           </div>
       </el-form>
       <!-- 自己写的样式 -->
        <!-- <div class="eachinput nameinput">
          <input type="text" name="" value="" placeholder="用户名">
        </div>
        <div class="eachinput pswinput">
          <input type="password" name="" value="" placeholder="密码">
        </div>
        <button type="button" name="button" class='loginbtn'>登录</button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          localStorage.setItem('ms_username', self.ruleForm.username)
          self.$router.push('/sort')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/img/login_bg.jpg");
    background-size: cover;
    .loginbox {
        width: 736px;
        height: 314px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -157px;
        margin-left: -368px;
        .logobox {
            float: left;
            width: 315px;
            border-right: 1px solid #404c62;
            height: 100%;
            background: url("../../assets/img/login_logo.png") no-repeat left center;
        }
        .inputbox {
            float: left;
            padding-left: 69px;
            .title {
                height: 73px;
                padding-top: 10px;
                font-size: 20px;
                color: #fff;
            }
            .eachinput {
                height: 35px;
                border-bottom: 1px solid #404c62;
                width: 340px;
                padding-left: 10px;
                input{
                    border: none;
                    background-color: transparent;
                    color: #52627f;
                    font-size: 14px;
                    &:-ms-input-placeholder {
                        color: #52627f;
                    }
                    &::-webkit-input-placeholder {
                        color: #52627f;
                    }
                }
            }
            .nameinput {
                margin-bottom: 46px;
            }
            .pswinput {
                margin-bottom: 78px;
            }
            .loginbtn {
                width: 350px;
                height: 46px;
                border-radius: 23px;
                background: #20a0ff;
                border: 0;
                color: #fff;
                font-size: 16px;
                letter-spacing: 7px;
                transition: 0.5s;
                cursor: pointer;
                &:hover {
                    transition: 0.5s;
                    background: #67b5ef;
                }
            }
        }
    }
}
</style>
