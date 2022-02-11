<template>
    <div>
        <div style="line-height:15px;margin-top: 20px" >
            <img :src="emptyUrl"  :width="width" :height="height">
        </div>
        <div style="line-height:15px;margin-bottom: 20px">
            <span style="font-size: 10px;color: #c0c4cc" >暂无数据</span>
        </div>


    </div>

</template>
<script>
    export  default {
      props:{
          width:{
              default :'121px',
          },
          height:{
              default :'100px',
          }
      },
        data(){
            return{
                emptyUrl:'img/bg/empty_bg.png',
            }
        }
    }
</script>

