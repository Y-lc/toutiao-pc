<template>
    <div>
        <!-- 删选项目 -->
        <el-card>
      <!-- 头部 -->
      <div slot="header">
       <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- 自己封装组件 -->
          <my-channel v-model="reqParams.charnnel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
          @change="changeData"
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-mm-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
        <!-- 筛选结果 -->
        <el-card>
          <div slot="header">
            根据筛选条件共查询到 {{total}} 条 结果:
          </div>
          <!-- 表格 -->
          <el-table :data="articles">
        <el-table-column  label="封面">
          <template slot-scope="scope">
        <el-image :src="scope.row.cover.images[0]" fit="cover" style="width:160px;height:100px">
        <div slot="error">
                <img src="../../assets/images/error.gif" alt="" style="width:160px;height:100px">
          </div>
          </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 数据 scope.row.status 值 0 1 2 3 4 代表不同的状态 -->
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1" >待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button @click="$router.push('/publish?id='+scope.row.id)" type="primary" icon="el-icon-edit" circle plain></el-button>
            <el-button type="danger" @click="delArticle(scope.row.id)" icon="el-icon-delete" circle plain></el-button>
          </template>
        </el-table-column>
      </el-table>
          <!-- 分页 -->
          <el-pagination
        class="pager"
        background
        layout="prev, pager, next, total"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        :total="total"
        @current-change="changepager"
      ></el-pagination>

        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 20
      },
      // 日期数据  0索引 起始时间 1索引  结束时间
      dateArr: [],
      articles: [],
      total: 0
    }
  },
  created () {
    // 获取文章列表数据
    this.getArticles()
  },
  methods: {
    // 删除文章
    delArticle (id) {
      this.$confirm('亲,确定删除？', '温馨提示', {
        confirmButtonText: '确定',
        concelButtonTxet: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`articles/${id}`)
        this.$message.success('删除成功')
        this.getArticles()
      }).catch(() => {

      })
    },
    // 搜索
    search () {
      this.reqParams.page = 1
      // if (this.reqParams.channel_id === '') {
      //   this.reqParams.channel_id = null
      // }
      this.getArticles()
    },
    // 切换分页
    changepager (newpage) {
      this.reqParams.page = newpage
      this.getArticles()
    },

    async getArticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    // 选择时间
    changeData (valueArr) {
      if (valueArr) {
        this.reqParams.begin_pubdate = valueArr[0]
        this.reqParams.end_pubdata = valueArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdata = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  margin-bottom: 20px;
}
.pager{
  text-align: center;
  margin-top: 20px;
}
</style>
