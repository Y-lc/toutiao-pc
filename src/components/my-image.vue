<template>
    <div class="img-container">
        <!-- 按钮图片 -->
        <div class="btn_img" @click="openDialog">
            <img :src="value||defaultImage" alt />
        </div>
        <!-- 对话框 -->
        <el-dialog :visible.sync="dialogVisible" width="750px">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="素材库" name="image">
                    <!-- 单选按钮 -->
                    <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
                        <el-radio-button :label="false">全部</el-radio-button>
                        <el-radio-button :label="true">收藏</el-radio-button>
                    </el-radio-group>
                    <!-- 图片列表 -->
                    <div class="img_list">
                        <div class="img_item" :class="{selected:item.url===selectedImageUrl}" @click="selectedImage(item.url)" v-for="item in images" :key="item.id">
                            <img :src="item.url" alt />
                        </div>
                    </div>
                    <!-- 分页 -->
                    <el-pagination style="text-align:center" background layout="prev,pager,next" :total="total" :page-size="reqParams.pper_page"
                    :current-page="changePager" @current-change="changePager"
                    hide-on-single-page>
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="上传图片 " name="upload">
      <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            name="image"
            :show-file-list="false"
            :on-success="handleSuccess">
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialoogVisible=false">取消</el-button>
                <el-button type="primary" @click="confirmImage">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import defaultImage from '../assets/images/default.png'
import store from '@/store'
export default {
  // 素材列表请求 参数对象
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'image',
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      images: [],
      //   素材总数
      total: 0,
      //   记录点击图片的标志
      selectedImageUrl: null,
      // 上传图片请求头
      headers: {
        Authorization: 'Bearer ' + store.getUser().token
      },
      // 上传成功后预览地址
      uploadImageUrl: null,
      //  确认后的图片地址
      // confirmSrc: defaultImage
      // 声明一个默认图
      defaultImage
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      let url = null
      if (this.activeName === 'image') {
        if (!this.selectedImageUrl) return
        this.$message.info('请选中一张图片')
        url = this.selectedImageUrl
      } else {
        if (!this.uploadImageUrl) return
        this.$message.info('请上传一张图片')
        url = this.uploadImageUrl
      }
      // this.confirmSrc = url
      // 把你确认的图片地址 提交给父组件
      this.$emit('input', url)
      this.dialogVisible = false
    },
    // 上传图片成功
    handleSuccess (res) {
      this.$message.success('上传图片成功')
      // 预览
      this.uploadImageUrl = res.data.url
    },
    //   选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
    },
    openDialog () {
      this.dialogVisible = true
      // 清楚 之前对话框的操作数据
      this.activeName = 'image'
      this.selectedImageUrl = null
      this.uploadImageUrl = null
      this.getImages()
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 设置总条数
      this.total = data.total_count
    },
    // 分页切换
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 全部与收藏切换
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    }
  }
}
</script>

<style lang="less" scoped>
.img-container{
  display: inline-block;
  margin-right: 20px;
}
.btn_img {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer{
  width: 100%;
  display: block;
  text-align: center;
}
.img_item{
    width: 160px;
    height: 120px;
    display: inline-block;
    border: 1px dashed #ddd;
    position:relative;
    margin-right: 10px;
    margin-bottom: 10px;

    &.selected{
      &::after{
        // .img_item.selected::after{} 解析后选择器
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.2) url(../assets/images/selected.png) no-repeat center / 50px
      }
    }

    img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
}

</style>
