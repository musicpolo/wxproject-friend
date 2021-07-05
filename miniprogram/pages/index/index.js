// miniprogram/pages/index/index.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[],
    listData:[],
    current:'link'
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
      this.getListData()
      this.getBannerList()
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
  // 点击点赞增加1
  handleLink(e){
    const id=e.target.dataset.id
    wx.cloud.callFunction({
      name:'update',
      data:{
        collection:'users',
        doc:id,
        data:'{link:_.inc(1)}'
      }
    }).then(res=>{
      const updated=res.result.stats.updated
      if(updated){
        const cloneListData=[...this.data.listData]
        for(let i=0;i<cloneListData.length;i++){
          if(cloneListData[i]._id===id){
            cloneListData[i].link++
          }
        }
        this.setData({
          listData:cloneListData
        })
      }
    })
  },
  // 点击切换标签
  handleClick(e){
    const tag=e.target.dataset.tag
    if(tag===this.data.current){
      return
    }
    this.setData({
      current:tag
    })
    this.getListData()
  },
  // 从数据库获取listData
  getListData(){
    db.collection('users').field({
      avatarUrl:true,
      nickName:true,
      link:true
    }).orderBy(this.data.current,'desc').get().then(res=>{
      this.setData({
        listData:res.data
      })
    })
  },
  handleDetail(e){
    const id=e.target.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?userid='+id,
    })
  },
  getBannerList(){
    db.collection('banner').orderBy('_id','desc').limit(4).get().then(res=>{
      console.log(res)
      this.setData({
        imgUrls:res.data
      })
    })
  }
})