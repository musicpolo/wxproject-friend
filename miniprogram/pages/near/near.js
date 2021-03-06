// miniprogram/pages/near/near.js
const app=getApp()
const db=wx.cloud.database()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude:'',
    markers:[]
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation()
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
  getLocation(){
    wx.getLocation({
      type: 'gcj02',
      success: (res)=> {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          latitude,
          longitude
        })
        this.getNear()
      }
    })
  },
  getNear(){
    db.collection('users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000,
      }),
      shareLocation:true
    }).field({
      latitude:true,
      longitude:true,
      nickName:true
    }).get().then(res=>{
      let data=res.data
      let result=[]
      if(data.length){
        for(let i=0;i<data.length;i++){ 
          result.push({
            iconPath:'/images/位置.png',
            id:data[i]._id,
            latitude:data[i].latitude,
            longitude:data[i].longitude,
            width:30,
            height:30,
            callout:{
              content:data[i].nickName,borderRadius:10,bgColor: "#fff",
              padding: "5px",
              borderRadius: "2px",
              borderWidth: "1px",
              borderColor: "#07c160",
              display:'ALWAYS'
            }
          })
        }
        this.setData({
          markers:result,
        })
      }
    })
  },
  calloutClick(e){
    wx.navigateTo({
      url: '/pages/detail/detail?userid='+e.markerId,
    })
  }
})