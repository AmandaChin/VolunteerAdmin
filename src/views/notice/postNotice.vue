<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="Title">
              <MDinput name="name" v-model="postForm.Title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
                <el-col >
                   <el-button style="margin-right:60px;" v-if="this.userData==null" v-loading="loading" type="primary" size="medium" @click="jumptoselect">选择用户
                   </el-button>
                   <div class="fontstyle"  v-else >您已选中<span style="font-style:oblique;color:#409EFF;"> {{this.userData.length}} </span>位用户
                   </div>
                </el-col>
            </div>
          </el-col>
        </el-row>

        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.Content" />
        </div>

        
      </div>
    </el-form>
   
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'
import port from '../../utils/manage'
import axios from 'axios'

const defaultForm = {
  status: 'draft',
  Title: '', // 文章题目
  Content: '', // 文章内容
}

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Multiselect, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rules, value, callback) => {
      if (value === '') {
        this.$message({
          message: rules.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      list: null,
      total: null,
      loading: false,
      userListOptions: [],
      rules: {
        Title: [{ validator: validateRequire }],
        Content: [{ validator: validateRequire }],
        source_uri: [{ trigger: 'blur' }]
      },
      userData:null,
      userLists:[]
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
    var id = JSON.parse(localStorage.getItem('adminid'))
    console.log('全局：'+id)
    global.global_userID = id
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.userData = this.$route.params.data
    
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // Just for test
        this.postForm.Title += `Article Id:${this.postForm.id}`
      }).catch(err => {
        console.log(err)
      })
    },
    HandleUserLists(data){
      for(var i =0;i<data.length;i++){
        this.userLists.push(data[i].UserID)
      }
      console.log(this.userLists)
    },
    // 需要重写的发布函数，需要对选中的用户发送
    submitForm() {
        var params = new URLSearchParams()
        if (this.postForm.Title.length == 0) {
          this.$message('通知标题禁止为空')
          return
        } else if (this.postForm.Content.length == 0) {
          this.$message('通知内容禁止为空')
          return
        } else if(this.userData==null||this.userData.length==0){
        this.$message('请至少选择一位用户')
          return
        }
          else {
            this.HandleUserLists(this.userData)
            let that = this;
            params.append('UserId', global.global_userID)
            params.append('Title', this.postForm.Title)
            params.append('Content', this.postForm.Content)
            params.append('UserLists',this.userLists)
            axios.post('http://' + port.info.host + ':' + port.info.port + '/api/postNewNotice', params).then(
            (res) => {
              console.log(res)
              if(res.data.num === 1){
               // console.log("testnumsuccess!!"+res.data.num)
                that.$notify({
                    title: '成功',
                    message: '发布通知成功',
                    type: 'success',
                    duration: 2000
                })
                setTimeout(() => {
                  this.$router.push({ name: 'notice' })

                }, 1000)
                 
              }else{
               // console.log("testnumfail!!"+res.data.num)
                that.$notify({
                    title: '失败',
                    message: '发布失败，请重新发布！',
                    type: 'error',
                    duration: 2000
                })
              }
            }
          ).catch((err) => {
            console.log(err)
            this.$notify({
            title: '失败',
            message: '发布失败，请重新发布！',
            type: 'error',
            duration: 2000
          })
          })
           
        }
    },
    // 跳转到用户选择页面的函数
    jumptoselect() {
      this.$router.push({ name: 'selectExcel'} )
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      float: right;
      @include clearfix;
      margin-bottom: 10px;
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.fontstyle{
  font-size: 20px;
  line-height: 40px;
  font-weight: bold;
  color : #606266;
  margin-right:60px;
}
</style>
