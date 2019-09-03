<template>
  <div class='container'>
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机号：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
             <el-form-item label="邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false" :http-requse="upload">
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center;font-size:14px">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/components/eventBus'
import store from '@/store'
export default {
  data () {
    return {
      userInfo: {
        name: '',
        intro: '',
        email: '',
        photo: ''
      },
      imageUrl: null
    }
  },
  created () {
    // 获取个人信息
    this.getUserInfo()
  },
  methods: {
    async upload (result) {
      const formData = new FormData()
      formData.append('photo', result.file)
      const { data: { data } } = await
      this.$http.patch('user/photo', formData)
      this.$message.success('修改头像成功')
      this.userInfo.photo = data.photo
      const user = store.getUser()
      user.photo = data.photo
      store.setUser(user)
      eventBus.$emit('updatePhoto', data.photo)
    },
    async save () {
      const { name, intro, email } = this.userInfo
      await this.$http.patch('user/profile', { name, intro, email })
      // 成功
      this.$message.success('修改用户信息成功')
      const user = store.getUser()
      user.name = name
      store.setUser(user)
      eventBus.$emit('updataName', name)
    },
    async getUserInfo () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userInfo = data
    }
  }
}
</script>

<style scoped lang='less'></style>
