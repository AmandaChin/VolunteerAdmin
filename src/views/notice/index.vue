<template>
<div class="noticeContainer">
  <div class="newNotice">
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" style = "margin-left:1500px" @click="jumptopost">发布新通知</el-button>
  </div>
  <el-table
    :data="noticeData.slice((pageNo-1)*pageSize,pageNo*pageSize)"
    style="width: 100%">

    <el-table-column label="标题">
      <template slot-scope="scope">
        <el-button type="text" @click="handleShowDialog(scope.row)">{{scope.row.Title}}</el-button>
      </template>
    </el-table-column>

    <el-table-column
      label="日期">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.ReleaseTime |formatDate}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="发布者">
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.UserName }}</el-tag>
          </div>
      </template>
    </el-table-column>

  </el-table>

  <el-dialog
        title="通知详情"
        :visible.sync="dialogVisible"
        width="30%"
        @close = 'closeDialog'>
        <el-form :model="temp">
          <el-form-item label="标题">
            <span>{{ temp.Title }}</span>
          </el-form-item>
          <el-form-item label="发布人">
            <span>{{ temp.UserName }}</span>
          </el-form-item>
          <el-form-item label="发布日期">
            <span>{{ temp.ReleaseTime|formatDate }}</span>
          </el-form-item>
          <el-form-item label="内容">
            <span v-html="temp.Content"></span>
          </el-form-item>
          </el-form>
        </el-dialog>
        <!--分页-->
    <div class="pagination-container" style = "margin-left:480px" >
      <el-pagination background @current-change="handleIndexChange"
                      :page-size="pageSize" :current-page.sync="pageNo" layout="total, prev, pager, next" :total="totalDataNumber">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { formatDate } from '@/methods/methods.js'
import port from '../../utils/manage'
//import global from '../../utils/global_userID'

  export default {
    data() {

      return {
        temp: {
        Title:undefined,
        NoticeID: undefined,
        Content:undefined,
        ReleaseTime:undefined,
        WriterName:undefined,
      },
        dialogVisible: false,
        noticeData: [],
        pageNo:1,
        pageSize:10,
        totalDataNumber:0
      }
    },
    created(){
      var id = JSON.parse(localStorage.getItem('adminid'))
      console.log('全局：'+id)
      global.global_userID = id
    },
    mounted() {
        axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getAllNotice').then(
          (res)=>{
            this.noticeData=res.data.list.rows;
            console.log(res.data);
             this.totalDataNumber = res.data.list.count;
            
          }
        ).catch((err)=>{
          console.log(err);
        })
    },
    filters: {

    formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd')
      }
  },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      jumptopost() {
      this.$router.push({ name: 'postNotice' })
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        var pageSize = this.pageSize
        this.getAndDraw(parseInt(pageNo),parseInt(pageSize))
      },
      handleShowDialog(row){
        this.temp = Object.assign({}, row) // copy obj
        this.dialogVisible = true  
      }
    }
  }
</script>

<style scoped>
.noticeContainer{
    padding: 32px;
}
</style>
