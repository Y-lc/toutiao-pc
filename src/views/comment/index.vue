<template>
  <div class='container'>
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
     <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="标题" prop="title" width="400px"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.comment_status?'正常':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button @click="toggleStatus(scope.row)" v-if="scope.row.comment_status" type="danger" size="small">关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row)" v-else type="success" size="small">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
     <!-- 分页 -->
      <el-pagination
        style="text-align:center;margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="changePager"
        hide-on-single-page
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      total: 0,
      reqParams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      }
    }
  },
  created () {
    this.getArtciles()
  },
  methods: {
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getArtciles()
    },
    async getArtciles () {
      const { data: { data } } = await
      this.$http.get('articles', { params: this.reqParams })
      console.log(data)
      this.articles = data.results
      this.total = data.total_count
    },
    // 打开或关闭评论
    async toggleStatus (row) {
      const { data: { data } } = await this.$http.put(`comments/status?article_id=${row.id}`, {
        allow_comment: !row.comment_status
      })
      this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
      row.comment_status = data.allow_comment
    }
  }
}
</script>

<style scoped lang='less'></style>
