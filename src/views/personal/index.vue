<template>
  <div class="personal">
    <div >
    <h1><i class="el-icon-document" style="margin-right:10px"></i>{{username}}的基本信息</h1>
    </div>
      <el-form ref="form" :model="personalInfo" label-width="120px">
          <el-form-item label="昵称">
            <el-col :span="9">
          <el-input v-model="personalInfo.UserName"></el-input>
          </el-col>
          </el-form-item>
          
          <el-form-item label="姓名">
            <el-col :span="9">
          <el-input v-model="personalInfo.Name"></el-input>
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

          <el-button type="primary" style="width:20%;margin-left:100px;" :loading="loading" @click.native.prevent="handleUpdate">修改</el-button>

      </el-form>
  </div>
</template>

<script>
import Photo from '@/components/Upload/singleImage'
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import axios from 'axios'
import port from '../../utils/manage'
import cityInfo from '../../utils/cityInfo'

export default {
  name: 'personal',
  components: {Photo},
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
     username:'',
      personalInfo: {
          UserName: '',
          Name: '',
          Gender: '',
          Phone: '',
          Email:'',
          IDNumber:'',
          region: []

      }

    }
  },
  created(){
    var id = JSON.parse(localStorage.getItem('adminid'))
    console.log('全局：'+id)
    global.global_userID = id
  },
    mounted() {
        // console.log(this.personalInfo.region)
         var that=this;
        axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getUserInfo',
        {
          UserId:global.global_userID
        }).then(
          (res)=>{

            console.log(res.data);
            that.personalInfo.UserName=res.data.UserName;
            that.personalInfo.Name=res.data.Name;
            that.personalInfo.Gender=res.data.Gender;
            that.personalInfo.Phone=res.data.Phone;
            that.personalInfo.Email=res.data.Email;
            that.personalInfo.IDNumber=res.data.IDNumber;
            that.username = res.data.UserName
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

  methods: {
      handleChange(value) {
        this.personalInfo.region[0]=value[0];
        this.personalInfo.region[1]=value[1];
        this.personalInfo.region[2]=value[2];

        console.log( this.personalInfo.region);
      },
      handleUpdate(){
        axios.post('http://' + port.info.host + ':' + port.info.port + '/api/changeUserInformation',
        {
            UserID:global.global_userID,
            Gender:this.personalInfo.Gender,
            UserName:this.personalInfo.UserName,
            Name:this.personalInfo.Name,
            IDNumber:this.personalInfo.IDNumber,
            Email:this.personalInfo.Email,
            Phone:this.personalInfo.Phone,
            Province:this.personalInfo.region[0],
            City:this.personalInfo.region[1],
            District:this.personalInfo.region[2]
        }).then(
            function(res){
                var num=res.data.num;
                console.log('修改函数返回值：'+num)
            },
            this.$message('修改成功')
        )

      },
      sexChangeHandler(value){
          this.personalInfo.Gender=value;
          console.log('改变之后的值：'+value)
      }
    }
}
</script>

<style scoped>
h1 {
  font-weight:100;
  margin-left:60px;
  color:#049BFF;

}
</style>