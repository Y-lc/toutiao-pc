<template>
  <div class='container'>
    <el-card>
      <div slot="header">
        <my-bread>{{articleId?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
         <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group @change="changeType" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
         <!-- 封面选择组件 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type===3">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
            <my-image v-model="articleForm.cover.images[1]"></my-image>
            <my-image v-model="articleForm.cover.images[2]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
         <el-form-item v-if="!articleId">
          <el-button type="primary" @click="submit(false)">发表</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="success" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      // 富文本的配置
      content: null,
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      },
      // 文章对象
      articleForm: {
        title: '',
        cover: {
          type: 1,
          images: []
        },
        content: '',
        channel_id: null
      },
      articleId: null
    }
  },
  created () {
    this.articleId = this.$route.query.id
    // 如果是编辑
    if (this.articleId) {
      this.getArticle()
    }
  },
  methods: {
    // 获取文章数据
    async getArticle () {
      const { data: { data } } = await this.$http.get(`articles/${this.articleId}`)
      // 填充表单
      this.articleForm = data
    },
    changeType () {
    // 选择过封面类型的时候 重置数据
      this.articleForm.cover.images = []
    },
    async submit (draft) {
      // 省去了校验
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    async update (draft) {
      // 地址栏多了ID  方式put
      await this.$http.put(`articles/${this.articleId}?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '修改时存入草稿成功' : '修改成功')
      this.$router.push('/article')
    }
  }
}
</script>

<style scoped lang='less'>
#app.ql-editor{
  height: 300px;
}
#app.ql-toolbar.ql-snow{
  padding: 0 8px;
}
.btn_img{
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
