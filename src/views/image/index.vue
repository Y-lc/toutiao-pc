<template>
    <div>
        <el-card>
            <div slot="header">
                <my-bread>素材管理</my-bread>
            </div>
            <!-- 按钮 -->
            <div class="btn_box">
        <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="openDialog()" style="float:right" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 图片列表 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="option">
            <span @click="toggleCollect(item)" class="el-icon-star-off" :class="{red:item.this_colllected}"></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
<!-- 分页 -->
       <el-pagination style="text-align:center" background layout="prev, pager, next" :total="total"
        :page-size="reqParams.per_page"
      :current-page="reqParams.page"
      @current-change="changePager"
      hide-on-single-page
       ></el-pagination>
    </el-card>
    <!-- 添加素材对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <!-- 上传组件 -->
      <el-upload
           class="avatar-uploader"
           action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
           :headers="headers"
           name="image"
           :show-file-list="false"
           :on-success="handleSuccess">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
export default {
  data () {
    return {
      reqParams: {
        // false 全部  true 收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 列表数据
      images: [],
      // 总条数
      total: 0,
      // 控制对话框显示与隐藏
      dialogVisible: false,
      // 上传图片的请求头配置
      headers: {
        Authorization: 'Bearer ' + store.getUser().token
      },
      // 预览图片的地址
      imageUrl: null
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 上传图片成功
    handleSuccess (res) {
      // 提示 与 预览
      this.$message.success('上传素材成功')
      // res 是后台的响应主体  预览地址res.data.url
      this.imageUrl = res.data.url
      // 2s后   关闭对话框 更新列表
      window.setTimeout(() => {
        this.dialogVisible = false
        this.reqParams.page = 1
        this.getImages()
      }, 2000)
    },
    // 打开对话框
    openDialog () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    // 删除图片
    delImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`user/images/${id}`)
        // 成功
        this.$message.success('删除图片成功')
        this.getImages()
      }).catch(() => {
      })
    },
    // 切换图片状态
    async toggleCollect (item) {
      const { data: { data } } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
      item.is_collected = data.collect
    },
    // 切换全部收藏
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    }
  }
}

</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 160px;
    height: 160px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .option {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 0;
      bottom: 0;
      color: #fff;
      text-align: center;
      line-height: 30px;
      span {
        margin: 0 30px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
