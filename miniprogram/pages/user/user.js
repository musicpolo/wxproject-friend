// miniprogram/pages/user/user.js
const db=wx.cloud.database()
const app=getApp()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    avatarUrl:'',
    nickName:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then(res=>{
      db.collection('users').where({
        _openid:res.result.openid
      }).get().then(res=>{
        if(res.data.length){
          app.userInfo=Object.assign(app.userInfo,res.data[0])
          this.setData({
            avatarUrl:app.userInfo.avatarUrl,
            nickName:app.userInfo.nickName,
            isLogin:true,
            id:app.userInfo._id
          })
          this.getMessage()
        } 
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
        nickName:app.userInfo.nickName,
        avatarUrl:app.userInfo.avatarUrl,
        id:app.userInfo._id 
    })
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
  getUserProfile(e){
    wx.getUserProfile({
      desc: 'desc',
      success:res=>{
        this.setData({
          avatarUrl:res.userInfo.avatarUrl,
          nickName:res.userInfo.nickName,
          id:app.userInfo._id
        })
      }
    })
    // 数据库中增加用户数据
    if(!this.data.isLogin && this.data.nickName){
      db.collection('users').add({
        data:{
          avatarUrl:this.data.avatarUrl,
          nickName:this.data.nickName,
          phoneNumber:'',
          wxNumber:'',
          signature:'',
          shareLocation:true,
          longitude:this.longitude,
          latitude:this.latitude,
          location:db.Geo.Point(this.longitude,this.latitude),
          link:0,
          friendList:[],
          time:new Date()
        }    
       }).then(res=>{
        db.collection('users').doc(res._id).get().then(res=>{
          app.userInfo=Object.assign(app.userInfo,res.data)
          this.setData({
              avatarUrl:app.userInfo.avatarUrl,
              nickName:app.userInfo.nickName, 
             isLogin:true
          })
        })
       })
    }
  },
  getMessage(){
    db.collection('message').where({
      userId:app.userInfo._id
    }).watch({
      onChange:function(snapshot){
        if(snapshot.docChanges.length){
          const list=snapshot.docChanges[0].doc.list
          if(list.length){
            wx.showTabBarRedDot({
              index: 1,
            })
            app.message=list
          }else{
            wx.hideTabBarRedDot({
              index: 1,
            })
            app.message=list
          }
        }
      },
      onError:function(err){
        console.error('the watch closed because of error', err)
      }
    })
  },
  getLocation(){
    wx.getLocation({
      type: 'gcj02',
      success: (res)=> {
        this.latitude = res.latitude
        this.longitude = res.longitude
        
      }
    })
  }
})