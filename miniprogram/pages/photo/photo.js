// miniprogram/pages/photo/photo.js
const app=getApp()
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:''
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
    this.setData({
      avatarUrl:app.userInfo.avatarUrl
    })
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
  
  handleClick(){
    wx.showLoading({
      title: '上传中',
    })
    const cloudPath=`userPhoto/${app.userInfo._openid}${Date.now()}.jpg`
    wx.cloud.uploadFile({
      cloudPath,
      filePath:this.data.avatarUrl,
      success:res=>{
        const fileID=res.fileID
        if(fileID){
          db.collection('users').doc(app.userInfo._id).update({
            data:{
              avatarUrl:fileID
            }
          })
        }
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '上传成功',
            })
          },
        })
        app.userInfo.avatarUrl=fileID
      },
    })

  },
  
  getUserProfile(e){
    wx.getUserProfile({
      desc: 'desc',
      success:res=>{
        this.setData({
          avatarUrl:res.userInfo.avatarUrl
        })
      }
    })
    
    if(this.data.avatarUrl){
        wx.showLoading({
          title: '更新中',
        })
        db.collection('users').doc(app.userInfo._id).update({
          data:{
            avatarUrl:this.data.avatarUrl
          }
        }).then(res=>{
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '更新成功',
              })
              app.userInfo.avatarUrl=this.data.avatarUrl
            }
          })
        })
    
    }
  },
  handleLoad(){
    wx.chooseImage({
      count: 1,
      success:res=>{
        const temp=res.tempFilePaths[0]
        this.setData({
          avatarUrl:temp
        })
      }
    })
  }
})