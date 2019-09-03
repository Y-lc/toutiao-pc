<template>
    <el-select :value="value" @change="fn" placeholder="请选择" clearable>
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  //   value数据只能读
  props: ['value'],
  data () {
    return {
      // 当前选择频道ID
    //   value: null,
      // 频道选项数据
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    fn (channelId) {
      //   提交给父组件
      if (channelId === '') channelId = null
      this.$emit('input', channelId)
    },
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('channels')
      // const data = { channels: [{ id: 1, name: 'java' }, { id: 2, name: '前端' }] }
      this.channelOptions = data.channels
    }
  }
}
</script>

<style scoped lang='less'></style>
