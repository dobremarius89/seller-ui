<template>
  <div id="container">
    <div id="content">
      <div id="left-content">
        <div id="header">
          <img src="@/assets/logo.png"/>
          <span id="welcome-text">Welcome back</span>
          <span id="welcome-text-extra">Welcome back! Please enter your details.</span>
        </div>
        <div id="login-form">
          <div class="login-field-container">
            <label class="login-field-label">Email</label>
            <input class="login-field-input" placeholder="Enter your email"/>
          </div>
          <div class="login-field-container">
            <label class="login-field-label">Password</label>
            <input class="login-field-input" placeholder="•••••••" type="password"/>
          </div>
          <div id="login-extras">
            <input id="remember-checkbox" type="checkbox">
            <label id="remember-text">Remember for 30 days</label>
            <label id="forgot-password-text">Forgot password</label>
          </div>
          <button id="login-form-button" @click="login">Sign in</button>
        </div>
      </div>
      <div id="right-content">
        <img id="right-image" src="@/assets/login/Section.png"/>
      </div>
    </div>
  </div>
</template>

<script>
import router, {Route} from "@/config/router.config";

export default {
  data: () => ({
    password: null,
    wrongUserName: null,
    wrongPassword: null,
    error: null
  }),

  methods: {
    login() {
      router.push({
        name: Route.HOME
      })
    }
  }
}
</script>

<style scoped>
#container {
  margin: 0 auto;
  width: 1920px;
  height: 100vh;
  background-color: white;
}

#content {
  display: flex;
}

#left-content {
  width: 50%;
  background-image: url("../assets/login/background.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center 10%;
}

#login-form {
  margin-top: 64px;
  margin-left: 25%;
  width: 50%;
}

#header {
  margin-top: 30%;
  text-align: center;
}

#header img, span {
  display: block;
  margin: 0 auto;
}

#right-content {
  width: 50%;
  height: 100vh;
}

#right-image {
  display: block;
  width: 100%;
  height: 100%;
}

#welcome-text {
  margin: 24px;
  font-size: 32px;
  font-family: Inter-SemiBold, serif;
}

#welcome-text-extra {
  margin-top: 24px;
  font-family: Inter-Regular, serif;
  font-size: 18px;
}

.login-field-container {
  margin-bottom: 32px;
  display: block;
}

.login-field-label {
  display: block;
  font-size: 16px;
  color: #344054;
  font-family: Inter-Medium, serif;
}

#login-extras {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}

#remember-checkbox {
  margin: 0;
  width: 16px;
  height: 16px;
}

#remember-text {
  margin-left: 10px;
  font-size: 16px;
  color: #344054;
  font-family: Inter-Medium, serif;
}

#forgot-password-text {
  margin-left: auto;
  font-size: 16px;
  color: #FE8325;
  font-family: Inter-SemiBold, serif;
}

.login-field-input {
  display: block;
  width: 100%;
  border-radius: 10px;
  font-size: 18px;
  font-family: Inter-Regular, serif;
  border: 1px solid #D0D5DD;
  margin-top: 10px;
  padding: 15px;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
}

#login-form-button {
  cursor: pointer;
  width: 100%;
  height: 53px;
  margin-top: 15px;
  border-radius: 10px;
  font-size: 18px;
  text-align: center;
  border: none;
  background-color: #FE8325;
  color: white;
  box-sizing: border-box;
  padding: 0;
  font-family: Inter-SemiBold, serif;
}
</style>
