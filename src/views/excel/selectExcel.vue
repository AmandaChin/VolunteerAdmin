<template>
  <div class="app-container">

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.UserID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="230px" align="center" label="姓名">
         <template slot-scope="scope">
           <span>{{scope.row.UserName}}</span>
         </template>
       </el-table-column>

      <el-table-column width="170px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.Gender}}</span>
        </template>
      </el-table-column>

      <el-table-column width="230px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.Phone}}</span>
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" label="状态" width="160">
        <template slot-scope="scope">
          <el-tag :type="scope.row.CanCheck | styleFilter">{{scope.row.CanCheck | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" v-on:click="scope.row.CanCheck=changestate(scope.row.CanCheck)">{{modifybutton(scope.row.CanCheck)}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import axios from 'axios'

export default {
  name: 'articleList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  filters: {
    styleFilter(status) {
      const styleMap = {
        1: 'success',
        0: 'danger'
      }
      return styleMap[status]
    },
     statusFilter(status) {
      const statusMap = {
        1: '已授权',
        0: '未授权'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changestate(status){
       if(status==1){
         return 0
         }
       else if(status==0){
         return 1
       }
    },
    modifybutton(status){
      if(status==1){
        return '收回'
      }
      else if(status==0)
      {
        return '授权'
      }
    },
    getList() {
      //this.listLoading = true
      //axios.get('http://' + port.info.host + ':' + port.info.port + '/api/getAllUser').then(
        axios.get('http://' + port.info.host + ':' + port.info.port + '/api/getOrdinaryUserInfo').then(
        (res) => {
          this.list = res.data.list.rows
          console.log(res)
          //this.listloading=false
        }
      ).catch((err) => {
        console.log(err)
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
