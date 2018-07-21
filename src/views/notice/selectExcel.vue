<template>
  <div class="app-container" style="padding:40px">
    <!-- $t is vue-i18n global function to translate lang -->
    <el-table  :data="list.slice((pageNo-1)*pageSize,pageNo*pageSize)" v-loading="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row @selection-change="handleSelectionChange"
     :row-class-name="tableRowClassName"  ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column align="center" label='UserID'>
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.UserID}}</span>
        </template>
      </el-table-column>
      <el-table-column label="UserName">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.UserName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
         <span style="margin-left: 10px"> {{scope.row.Name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="IDNumber"  align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.IDNumber}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-container" style = "margin-left:480px" >
      <el-pagination background @current-change="handleCurrentChange"
                      :page-size="pageSize" :current-page.sync="pageNo" layout="total, prev, pager, next" :total="totalDataNumber">
      </el-pagination>
    </div>

    <el-row>
    <el-col :span="24">
      <el-button style="float:right;"  type="primary" @click="certainselect">确定选择
      </el-button>
    </el-col>
    </el-row>
  </div>
</template>

<script>

import { fetchList } from '@/api/article'
import axios from 'axios'
import port from '../../utils/manage'
export default {
  name: 'selectExcel',
  data() {
    return {
      pageNo:1,
      pageSize:10,
      totalDataNumber:0,
      list: null,
      listLoading: true,
      multipleSelection: [],
      filename: '',
      listQuery: {
        UserID : undefined,
        UserName : undefined,
        Name : undefined,
        IDNumber : undefined
      },
      temp: {
        UserID: undefined,
        UserName: undefined,
        Name: undefined,
        IDNumber: undefined,
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      //需要添加一个获得所有用户的函数getAllDemand改成获得所有用户
      //axios.post('http://localhost:3000/api/getAllUsers')
      axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getAllUsers')
      .then(
          (res)=>{
            this.list=res.data.list.rows;
            this.totalDataNumber = res.data.list.count;
            this.listLoading = false
          }
        ).catch((err)=>{
          console.log(err);
        })
    },
   
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
        this.listQuery.page = val
        var pageSize = this.pageSize
        this.getAndDraw(parseInt(pageNo),parseInt(pageSize))
      },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    //确定好选择的用户的函数，把函数传到发布函数中。。。
    certainselect() {
      if (this.multipleSelection.length) {  
          const theUsers = ['UserID']
          const list = this.multipleSelection
          const data = this.formatJson(theUsers, list)
          this.$router.push({ name: 'postNotice', params: { data: list }})
          this.$refs.multipleTable.clearSelection()
      } else {
        this.$message({
          message: '请至少选择一位用户',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

</style>
