<template>
   <el-container class="home-container">
    <el-aside :width="isCollapse?'64px':'240px'">
        <!-- logo -->
        <div class="logo" :class="{'miniLogo':isCollapse}"></div>
        <!-- 导航菜单 -->
       <el-menu
        default-active="/"
        class="el-menu-vertical-demo"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/articr">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/seeting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>

    </el-aside>
    <el-container>
      <el-header>
<!-- 头部结构 -->
        <span @click="toggleMenu()" class="icon el-icon-s-fold"></span>
        <span class="text">江苏传智播客科技教育有限公司</span>
        <el-dropdown class="my-dropdown">
          <span class="el-dropdown-link">
            <!-- 头像 用户名称 -->
            <img class="avatar" src="photo" alt="">
            <span class="username"> {{name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" @click.native="setting()">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" @click.native="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 二级路由对应组件渲染 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import store from '@/store'
export default {
  data () {
    return {
      isCollapse: false,
      name: '',
      photo: ''
    }
  },
  created () {
    const user = store.getUser()
    this.name = user.name
    this.photo = user.photo
  },
  methods: {
    // 设置页面
    setting () {
      this.$router.push('/setting')
    },
    // 退出登录
    logout () {
      store.delUser()
      this.$router.push('/login')
    },
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
    width: 100%;
    height: 100%;
    position:absolute;
    left: 0;
    top: 0;
    .el-aside{
        background:#002033;
        .logo{
            width: 100%;
            height: 60px;
            background: #002244 url(../../assets/images/logo_admin.png)no-repeat
        center / 140px auto;
        }
        .miniLogo{
      background-image: url(../../assets/images/logo_admin_01.png);
      background-size: 36px auto;
    }
        .el-menu{
            border-right: none;
        }
    }
    .el-header{
       border-bottom: 1px solid #ddd;
       line-height: 60px;
       font-size: 24px;
       vertical-align: middle;
        padding-right: 10px;
    }
    .text {
      vertical-align: middle;
    }
    .my-dropdown{
      float: right;
      .avatar{
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .username{
        font-weight: bold;
        color: #333;
        vertical-align: middle;
      }
    }

}
</style>
