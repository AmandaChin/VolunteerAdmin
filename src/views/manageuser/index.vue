<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="服务内容"
      v-model="listQuery.content">
      </el-input> -->

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户ID"
      v-model="listQuery.UserID">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="昵称"
      v-model="listQuery.UserName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="真实姓名"
      v-model="listQuery.Name">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="身份证号"
      v-model="listQuery.IDNumber">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' 
    :data="list.slice((pageNo-1)*pageSize,pageNo*pageSize)" 
    v-loading="listLoading" element-loading-text="加载中" border fit highlight-current-row
      style="width: 1355px">
    <!--需要调用数据-->
      <el-table-column width="100px" align="center" label="用户ID">
        <template slot-scope="scope">
          <span>{{scope.row.UserID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.UserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="真实姓名">
        <template slot-scope="scope">
          <span>{{scope.row.Name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{scope.row.IDNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.Email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.Phone}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="160">
        <template slot-scope="scope">
          <el-tag :type="scope.row.CanCheck | styleFilter">{{scope.row.CanCheck | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="权限管理" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.CanCheck ==0" type="primary" icon="el-icon-star-off"  @click="handleShowDialog(scope.row)">授权</el-button>
          <el-button v-if="scope.row.CanCheck ==1" type="primary" icon="el-icon-delete"  @click="handleShowDialog(scope.row)">收回</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!--分页-->
    <div class="pagination-container" style = "margin-left:450px">
      <el-pagination background @current-change="handleIndexChange"
                      :page-size="pageSize" :current-page.sync="pageNo" layout="total, prev, pager, next" :total="totalDataNumber">
      </el-pagination>
    </div>

    <!--点击按钮之后的表单-->
         <el-dialog title="权限设置" :visible.sync="dialogFormVisible" width="25%">
          <el-form :model="temp" label-position="left"  style="margin-left:50px">
            <!-- <el-form-item label="UserID" prop="UserID">
              <span>{{temp.UserID }}</span>
            </el-form-item>

            <el-form-item label="UserName" prop="UserName">
              <span>{{ temp.UserName }}</span>
            </el-form-item>

            <el-form-item label="Name" prop="Name">
              <span>{{ temp.Name }}</span>
            </el-form-item>

            <el-form-item label="IDNumber" prop="IDNumber">
              <span>{{ temp.IDNumber }}</span>
            </el-form-item> -->
 
          </el-form>
          <span style="fontSize:20px" type="text" align ="center">确定更改审核权限吗？</span>
          <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ChangeAuthority(temp.UserID)">更改</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
 
          </div>
        </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import axios from 'axios'
import port from '../../utils/manage'
//import global from '../../utils/global_userID'


export default {
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
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
      },
      dialogFormVisible: false,
      dialogStatus: '',
      pageNo:1,
      pageSize:10,
      totalDataNumber:0

    }
  },
  created() {
    this.getList()
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
  methods: {
    getList() {
      this.listLoading = true
      //需要添加一个获得所有用户的函数getAllDemand改成获得所有用户
      axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getAllUsers')
      .then(
          (res)=>{
            this.list=res.data.list.rows;
            console.log('res'+res.data.list);
            this.listLoading = false
            this.totalDataNumber = res.data.list.count;
          }
        ).catch((err)=>{
          console.log(err);
        })
    },
     handleCurrentChange(val) {
        this.listQuery.page = val
        var pageSize = this.pageSize
        this.getAndDraw(parseInt(pageNo),parseInt(pageSize))
      },
    //处理search函数，与最上方的搜索栏相关联
    handleFilter() {
      this.listQuery.page = 1
      // this.getList()
      this.listLoading=true
            var UserID = this.listQuery.UserID
            var UserName = this.listQuery.UserName
            var Name = this.listQuery.Name
            var IDNumber = this.listQuery.IDNumber
            var params = new URLSearchParams()
            console.log(this.listQuery.UserID)
            if (this.listQuery.UserID==undefined)
            {
              console.log("undefined UserID")
              UserID=0   
            }else{
              console.log("UserID"+UserID)
              UserID=this.listQuery.UserID
            }

            if (this.listQuery.UserName==undefined)
            {
              console.log("undefined UserName")
              UserName='undefined'
            }else{
              console.log(" UserName")
              UserName=this.listQuery.UserName
            }

            if (this.listQuery.Name==undefined)
            {
              console.log("undefined Name")
              Name='undefined'
            }else{
              console.log(" Name")
              Name=this.listQuery.Name
            }

            if (this.listQuery.IDNumber==undefined)
            {
              console.log("undefined IDNumber")
              IDNumber='undefined'
            }else{
              console.log(" IDNumber")
              IDNumber=this.listQuery.IDNumber
            }
            params.append('UserID',UserID)
            params.append('UserName',UserName)
            params.append('Name',Name)
            params.append('IDNumber',IDNumber)
            console.log("传值查询"+IDNumber)
            if((UserID!=0)||(UserName!=0)||(Name!=0)||(IDNumber!=0)){
              console.log("enter")
              axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getUsersByCondition',params).then(
                (res)=>{
                this.list=res.data.list;
                console.log(res.data.list);
                if(res.data.list !== 'null')
                {
                  console.log("enter page")
                  this.totalDataNumber = res.data.list.length;
                }else{
                  this.totalDataNumber = 0;
                }
                
                this.listLoading = false
              }
              ).catch((err)=>{
              console.log(err);
              })
            }
            else{
              this.getList()
            }
          //加后台加后台加后台函数
          // this.listLoading = false
    },

    //志愿者申请,需要更改为权限设置，需要在数据库里加一个表示是否有权限的量
     ChangeAuthority(UserID) {
       let that = this;
      // var UserID = this.listQuery.UserID
       var params = new URLSearchParams()
       params.append('UserID',UserID)
       console.log("ID!!!!!"+UserID)
       axios.post('http://' + port.info.host + ':' + port.info.port + '/api/ChangeAuthority', params).then(
         function(res){
           
           if(res.data.num === 1){
               // console.log("testnumsuccess!!"+res.data.num)
                that.$notify({
                    title: '成功',
                    message: '已更改权限',
                    type: 'success',
                    duration: 2000
                })
                setTimeout(() => {
                  that.listLoading = true
                  axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getAllUsers').then(
                    (res)=>{
                      console.log(res.data.list);
                        that.list=res.data.list.rows;
                         that.listLoading = false
                         this.totalDataNumber = res.data.list.length;
                        console.log("刷新页面后"+res);
                       
                          }
                  ).catch((err)=>{
                      console.log(err);
                  })

                }, 1000)
                 
              }else{
               // console.log("testnumfail!!"+res.data.num)
                that.$notify({
                    title: '失败',
                    message: '更改失败,请重新更改',
                    type: 'error',
                    duration: 2000
                })
              }
         }
       )
      this.dialogFormVisible = false
      // this.$notify({
      //         title: '成功',
      //         message: '已更改权限',
      //         type: 'success',
      //         duration: 2000
      //       })

    },
    
    handleShowDialog(row){
      this.temp = Object.assign({}, row) // copy obj
      console.log("temp!!!!!"+this.temp.UserID)
      this.dialogFormVisible = true
    },

    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
  }
}
</script>
