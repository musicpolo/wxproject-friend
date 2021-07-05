// miniprogram/pages/detail/detail.js
const db=wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    isFriend:false,
    isHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id=options.userid
    db.collection('users').doc(id).get().then(res=>{
      this.setData({
        detail:res.data
      })
      let friendList=res.data.friendList
      if(friendList.includes(app.userInfo._id)){
        this.setData({
          isFriend:true
        })
      }else{
        this.setData({
          isFriend:false
        },()=>{
          if(id==app.userInfo._id){
            this.setData({
              isFriend:true,
              isHidden:true
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleAddFriend(){
    if(app.userInfo._id){
      db.collection('message').where({
        userId:this.data.detail._id
      }).get().then(res=>{
        const id=app.userInfo._id
        if(res.data.length){
          if(res.data[0].list.includes(id)){
            wx.showToast({
              title: '已添加过',
            })
          }else{
            wx.cloud.callFunction({
              name:'update',
              data:{
                collection:'message',
                where:{
                  userId:this.data.detail._id
                },
                data:`{list:_.push('${id}')}` 
              }
            }).then(res=>{
              wx.showToast({
                title: '更新成功',
              })
            })
          }
        }else{
          db.collection('message').add({
            data:{
              userId:this.data.detail._id,
              list:[id]
            }
          }).then(res=>{
            wx.showToast({
              title: '添加成功',
            })
          })
        }
      })
    }else{
      wx.showToast({
        title: '请登录',
        duration:2000,
        complete:()=>{
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/user/user',
            },2000)
          })
        }
      })
    }
  }
})