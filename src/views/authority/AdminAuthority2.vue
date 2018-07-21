<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <el-button style='margin:0 0 20px 20px;' type="primary" v-on:click="watchtable=false">添加B类管理员</el-button>
    <el-button style='margin:0 0 20px 20px;' type="primary" v-on:click="watchtable=true">返回</el-button>
    <el-table style="margin:50px" v-if="watchtable==true" :data="list.slice((pageNo-1)*pageSize,pageNo*pageSize)" v-loading="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label='Id' width="250">
        <template slot-scope="scope">
          {{scope.row.UserID}}
        </template>
      </el-table-column>
      <el-table-column label="昵称"  width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.UserName}}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="200" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.Gender}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="450" align="center">
        <template slot-scope="scope">
          {{scope.row.Phone}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="450" align="center">
        <template slot-scope="scope">
          {{scope.row.Email}}
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div  v-if="watchtable==true"  class="pagination-container" style = "margin-left:480px" >
      <el-pagination background @current-change="handleIndexChange"
                      :page-size="pageSize" :current-page.sync="pageNo" layout="total, prev, pager, next" :total="totalDataNumber">
      </el-pagination>
    </div>
<template v-if="watchtable==false">
  <div class="personal">
    <h1 >添加B类管理员</h1>
      <el-form ref="form" :model="personalInfo" label-width="120px">

           <el-form-item label="用户名">
            <el-col :span="9">
          <el-input v-model="personalInfo.Account"></el-input>
          </el-col>
          </el-form-item>

          <el-form-item label="昵称">
            <el-col :span="9">
          <el-input v-model="personalInfo.UserName"></el-input>
          </el-col>
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="personalInfo.Gender" @change="sexChangeHandler">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
         </el-form-item>

          <!--<el-form-item label="出生日期">
          <el-col :span="9">
            <el-date-picker type="date" placeholder="选择您的出生日期" v-model="personalInfo.birthday" style="width: 100%;">
            </el-date-picker>
          </el-col>
        </el-form-item>-->

          <el-form-item label="手机号">
          <el-col :span="9">
          <el-input v-model="personalInfo.Phone"></el-input>
          </el-col>
          </el-form-item>

          <el-form-item label="注册邮箱">
          <el-col :span="9">
          <el-input v-model="personalInfo.Email"></el-input>
          </el-col>
          </el-form-item>

          <el-form-item label="所在地区">
          <el-cascader
           expand-trigger="hover"
           placeholder="选择您所在地区"
           :options="cityInfo"
           v-model="personalInfo.region"
           @change="handleChange">
          </el-cascader>
          </el-form-item>

          <el-form-item label="身份证号">
          <el-col :span="9">
          <el-input v-model="personalInfo.IDNumber"></el-input>
          </el-col>
          </el-form-item>

          <!--<el-row>
              <el-col span="3">
              <el-form-item label="更改头像"></el-form-item>
              </el-col>
              <el-col span="9">
                  <Photo  style="width:800px" v-model="personalInfo.image_uri" ></Photo>
              </el-col>
          </el-row>-->

          <el-button type="primary" style="width:20%;margin-left:100px;" :loading="loading" @click.native.prevent="handleUpdate" v-on:click="watchtable=true">提交</el-button>
      </el-form>
  </div>
</template>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { parseTime } from '@/utils'
import Photo from '@/components/Upload/singleImage'
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import axios from 'axios'
import port from '../../utils/manage'
import cityInfo from '../../utils/cityInfo'

export default {
  name: 'exportExcel',
  data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(null)
          }
        } else {
          callback()
        }
      }
    return {
      loading: false,
     cityInfo: cityInfo.info.cityInfo,
      watchtable:true,
      list: null,
      listLoading: false,
      downloadLoading: false,
      filename: '',
      autoWidth: 'A',
      personalInfo: {
          Password:'123456',
          Account:'',
          UserName: '',
          Gender: '',
          Phone: '',
          Email:'',
          IDNumber:'',
          region: []

      },
      pageNo:1,
      pageSize:10,
      totalDataNumber:0

    }
  },
  created() {
    this.fetchB_AdminData()
  },
  methods: {
    fetchB_AdminData() {
        axios.get('http://' + port.info.host + ':' + port.info.port + '/api/getB_AdminInfo').then(
        (res) => {
          this.list = res.data.list.rows
          this.totalDataNumber = res.data.list.count;
          console.log(res)
          //this.listloading=false
        }
      )
    },
    
    
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
     handleChange(value) {
        this.personalInfo.region[0]=value[0];
        this.personalInfo.region[1]=value[1];
        this.personalInfo.region[2]=value[2];

        console.log( this.personalInfo.region);
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        var pageSize = this.pageSize
        this.getAndDraw(parseInt(pageNo),parseInt(pageSize))
      },
      handleUpdate(){
        let that = this
        axios.post('http://' + port.info.host + ':' + port.info.port + '/api/addAdmin',
        {
            Account:this.personalInfo.Account,
            Password:this.personalInfo.Password,
            theRes:2,
            UserName:this.personalInfo.UserName,
            Gender:this.personalInfo.Gender,
            IDNumber:this.personalInfo.IDNumber,
            Email:this.personalInfo.Email,
            Phone:this.personalInfo.Phone,
            Province:this.personalInfo.region[0],
            City:this.personalInfo.region[1],
            District:this.personalInfo.region[2]
        }).then(
            function(res){
              
              console.log(res)
                var num=res.data.addtype;
                console.log('函数返回值：'+num)
                that.$message('添加成功')
                that.fetchB_AdminData()
            },
            
        )
      },
      sexChangeHandler(value){
          this.personalInfo.Gender=value;
          console.log('改变之后的值：'+value)
      }
  },

  components: {Photo},
  
    mounted() {
        
    },

}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>

