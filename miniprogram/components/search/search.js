// components/search/search.js
const app=getApp()
const db=wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus:false,
    historyList:[],
    searchList:[],
    search:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCancel(){

      this.setData({
        isFocus:false,
        search:''
      })
    },
    handleFocus(){
      wx.getStorage({
        key:'searchHistory',
        success:res=>{
          this.setData({
            historyList:res.data
          })
        }
      })
      this.setData({
        isFocus:true
      })
    },
    handleComfirm(e){
      let cloneHistory=[...this.data.historyList]
      cloneHistory.unshift(e.detail.value)
      wx.setStorage({
        key:'searchHistory',
        data:[...new Set(cloneHistory)]
      }),
      this.changeSearchList(e.detail.value)
    },
    handleClear(){
      wx.removeStorage({
        key: 'searchHistory',
        success:res=>{
          this.setData({
            historyList:[]
          })
        }
      })
    },
    changeSearchList(value){
      db.collection('users').where({
        nickName:db.RegExp({
          regexp:value,
          options:'i'
        })
      }).field({
        avatarUrl:true,
        nickName:true
      }).get().then(res=>{
        this.setData({
          searchList:res.data
        })
      })
    },
    handleHistory(e){
     let value= e.target.dataset.item
     this.changeSearchList(value)
    }
  }
})
