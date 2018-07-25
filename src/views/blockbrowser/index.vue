<template>
  <div class="documentation-container">
  <slide-show :slides="slides" :inv="slideSpeed"></slide-show>
  <el-button type="primary" size="medium"  @click="handleSubmit">跳 转</el-button>
  
</div>
</template>
<script>
import DropdownMenu from '@/components/Share/dropdownMenu'
import slideShow from '@/components/SlideShow/slideShow'

export default {
  name: 'documentation',
  components: { DropdownMenu, slideShow },
  data() {
    return {
      errGif: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      slides: [
        {
          src: require('./image/1.jpg'),
          title: '欢迎志愿者的加入',
          href: 'http://10.10.1.201:18000'
        },
        {
          src: require('./image/2.jpg'),
          title: '像小天使般的志愿者',
          href: 'http://10.10.1.201:18000'
        },
        {
          src: require('./image/3.jpg'),
          title: '志愿服务从今天开始',
          href: 'http://10.10.1.201:18000'
        },
        {
          src: require('./image/4.jpg'),
          title: '志愿服务从小做起',
          href: 'http://10.10.1.201:18000'
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      window.location.href = 'http://10.10.1.201:18000'
    }
  }
}
// window.location.href="http://localhost:8000"
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    vertical-align: middle;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
