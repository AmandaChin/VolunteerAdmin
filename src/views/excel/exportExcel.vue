<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <el-radio-group v-model="autoWidth" @change="setTypeHandler">
      <el-radio label="A" border>A</el-radio>
      <el-radio label="B" border>B</el-radio>
    </el-radio-group>
    <el-button style='margin:0 0 20px 20px;' type="primary" v-on:click="watchtable=false">添加管理员</el-button>
    <el-button style='margin:0 0 20px 20px;' type="primary" v-on:click="watchtable=true">返回</el-button>
    <el-table v-if="watchtable==true" :data="list" v-loading="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label='Id' width="135">
        <template slot-scope="scope">
          {{scope.row.UserID}}
        </template>
      </el-table-column>
      <el-table-column label="姓名"  width="220" align="center">
        <template slot-scope="scope">
          {{scope.row.UserName}}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="160" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.Gender}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="275" align="center">
        <template slot-scope="scope">
          {{scope.row.Phone}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="275" align="center">
        <template slot-scope="scope">
          {{scope.row.Email}}
        </template>
      </el-table-column>
    </el-table>
<template v-if="watchtable==false">
  <div class="personal">
    <h1 >添加{{type}}类管理员</h1>
      <el-form ref="form" :model="personalInfo" label-width="120px">

           <el-form-item label="用户名">
            <el-col :span="9">
          <el-input v-model="personalInfo.Account"></el-input>
          </el-col>
          </el-form-item>

          <el-form-item label="姓名">
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
      type:'A',
      loading: false,
     cityInfo: cityInfo.info.cityInfo,
      watchtable:true,
      list: null,
      listLoading: false,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      personalInfo: {
          Password:'123456',
          Account:'',
          UserName: '',
          Gender: '',
          Phone: '',
          Email:'',
          IDNumber:'123421196708138944',
          region: []

      }

    }
  },
  created() {
    this.fetchA_AdminData()
    var id = JSON.parse(localStorage.getItem('adminid'))
    console.log('全局：'+id)
    global.global_userID = id
  },
  methods: {
    fetchA_AdminData() {
      // this.listLoading = true
      // fetchList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
        axios.get('http://' + port.info.host + ':' + port.info.port + '/api/getA_AdminInfo').then(
        (res) => {
          this.list = res.data.list.rows
          console.log(res)
          //this.listloading=false
        }
      )
    },
    fetchB_AdminData() {
      // this.listLoading = true
      // fetchList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
        axios.get('http://' + port.info.host + ':' + port.info.port + '/api/getB_AdminInfo').then(
        (res) => {
          this.list = res.data.list.rows
          console.log(res)
          //this.listloading=false
        }
      )
    },
    setTypeHandler(value){
      this.type=value;
      if(value=='A')this.fetchA_AdminData()
      else if(value=='B')this.fetchB_AdminData()
      console.log('改变之后的值：'+value)
    },
    getTheRes(value){
      if(value=='A')return 1
      else if(value=='B')return 2
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
        const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
        })
        this.downloadLoading = false
      })
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
      handleUpdate(){
        axios.post('http://' + port.info.host + ':' + port.info.port + '/api/addAdmin',
        {
            theRes:this.getTheRes(this.type),
            Password:this.personalInfo.Password,
            Account:this.personalInfo.Account,
            Gender:this.personalInfo.Gender,
            UserName:this.personalInfo.UserName,
            IDNumber:this.personalInfo.IDNumber,
            Email:this.personalInfo.Email,
            Phone:this.personalInfo.Phone,
            // Province:this.personalInfo.region[0],
            // City:this.personalInfo.region[1],
            // District:this.personalInfo.region[2]
        }).then(
            function(res){
                var num=res.data.num;
                console.log('修改函数返回值：'+num)
                this.$message('添加成功')
            },
            this.$message('添加成功')
        )
      },
      sexChangeHandler(value){
          this.personalInfo.Gender=value;
          console.log('改变之后的值：'+value)
      }
  },

  components: {Photo},
  
    mounted() {
        // console.log(this.personalInfo.region)
         var that=this;
        axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getUserInfo',
        {
          UserId:global.global_userID
        }).then(
          (res)=>{

            console.log(res.data);
            that.personalInfo.Passwordt=res.data.Password;
            that.personalInfo.Account=res.data.Account;
            that.personalInfo.UserName=res.data.UserName;
            that.personalInfo.Gender=res.data.Gender;
            that.personalInfo.Phone=res.data.Phone;
            that.personalInfo.Email=res.data.Email;
            that.personalInfo.IDNumber=res.data.IDNumber;
            var arr=new Array();
            arr.push(res.data.Province);
            arr.push(res.data.City);
            arr.push(res.data.District);
            that.personalInfo.region=arr;
          }
        ).catch((err)=>{
          console.log(err);
        })
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

