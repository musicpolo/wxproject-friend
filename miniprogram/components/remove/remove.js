// components/remove/remove.js
const app=getApp()
const db=wx.cloud.database()
const _=db.command
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleRemove(){
      wx.showModal({
        title:'提示信息',
        content:'删除信息',
        confirmText:'删除',
        confirmColor: '#f00',
        success:(res)=>{
          if(res.confirm){
            this.messageRemove()
          }else if(res.cancel){

          }
        }
      })
    },
    messageRemove(){
      db.collection('message').where({
        userId:app.userInfo._id
      }).get().then(res=>{
        let list=res.data[0].list
        list=list.filter((val,i)=>{
          return val!=this.data.messageId
        })
        wx.cloud.callFunction({
          name:'update',
          data:{
            collection:'message',
            where:{userId:app.userInfo._id},
            data:{
              list
            }
          }
        }).then(res=>{
          this.triggerEvent('myevent',list)
        })
      })
    },
    handleAdd(){
      wx.showModal({
        title:'提示信息',
        content:'添加好友',
        confirmText:'添加',
        success:res=>{
          db.collection('users').doc(app.userInfo._id).update({
            data:{
              friendList:_.push(this.data.messageId)
            }
          })
          wx.cloud.callFunction({
            name:'update',
            data:{
              collection:'users',
              doc:this.data.messageId,
              data:`{friendList:_.push('${app.userInfo._id}')}`
            }
          })
        }
      })
      this.messageRemove()
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId).field({
        avatarUrl:true,
        nickName:true
      }).get().then(res=>{
        this.setData({
          userMessage:res.data
        })
      })
    }
  }
})
