<template>
  <view class="btn">
    <button type="success" size="default" shape="circle" @click="Login">
      授权登录</button>
  </view>

</template>

<script>
	import {login} from "../../api/login";
  import localStorage from "../../utils/localStorage";

  export default {
		data() {
			return {

			}
		},
		methods: {

      getUserInfo() {
        return new Promise((resolve, reject) => {
          wx.getUserProfile({
            lang: 'zh_CN',
            desc: '用户登录',
            success: (res) => {
              resolve(res.userInfo)
            },
            fail: (err) => {
              reject(err)
            }
          })
        })
      },

      getLogin() {
        return new Promise((resolve, reject) => {
          wx.login({
            success(res) {
              resolve(res.code)
            },
            fail: (err) => {
              reject(err)
            }
          })
        })
      },

      Login() {
        let userInfo = this.getUserInfo();
        let wxCode = this.getLogin();
        console.log(wxCode)
        Promise.all([userInfo, wxCode]).then((res) => {
          //带上信息去后端请求登录
          login(res[1],res[0].nickName,res[0].avatarUrl).then((res)=>{
             localStorage.setItem("openid",res)
          })
        }).catch(err => {

        })
      }
		},

	}
</script>

<style>

</style>
