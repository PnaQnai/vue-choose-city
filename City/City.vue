<template>
  <div class="city">
    <TopNav></TopNav>
    <div class="search" ref="search">
      <img src="./img/search.png" alt class="search-btn">
      <input type="text" placeholder="请输入城市名称或首字母查询" v-model="searchVal">
    </div>
    <div class="now-look">
      <p>您正在看：</p>
      <p class="current-city" v-if="!showCity" ref="current">郑州市</p>
      <p class="current-city" v-if="showCity" ref="current">{{nowCity}}</p>
      <!-- 箭头变换 -->
      <p class="choose-xq" @click="isShow = !isShow">
        选择县区
        <img src="./img/arrow-down.png" alt class="arrow-down" v-if="isShow">
        <img src="./img/arrow-up.png" alt class="arrow-down" v-else>
      </p>
      <!-- 热门城市 -->
      <div class="reco-city flex-x-between" v-if="!isShow">
        <!-- <ul class="flex flex-x-between" v-for="(item,index) in disArea" :key="index">
          <li>{{item.regionName}}</li>
          <li>{{(item+1).regionName}}</li>
          <li>{{(item+2).regionName}}</li>
        </ul>-->
        <div v-for="(item,index) in disArea" :key="index" @click="getArea">{{item.regionName}}</div>
        <!-- 当到达最底的时候提示全城 -->
        <div v-if="disArea.length===0" @click="getArea">全城</div>
        <!-- <ul class="flex flex-x-between">
          <li>新密市</li>
          <li>新郑市</li>
          <li>中牟县</li>
        </ul>
        <ul class="flex flex-x-between">
          <li>巩义市</li>
          <li>荥阳市</li>
          <li>近郊</li>
        </ul>-->
      </div>
      <div class="current-local">
        <p>当前定位</p>
        <div class="now-local">
          <img src="./img/local.png" alt>
          <!-- 从本地定位中获取 -->
          <span @click="locationArea">登封市</span>
        </div>
      </div>
    </div>
    <div ref="cityList">
      <mt-index-list :show-indicator="true">
        <mt-index-section
          v-for="letter in citySortArr"
          :key="letter"
          :index="letter"
          v-show="regListItem(letter)"
          @click.native="changeNav"
        >
          <mt-cell
            v-for="cityName in cityArr"
            :key="cityName"
            v-if="cityName.key == letter"
            :title="cityName.value "
          ></mt-cell>
        </mt-index-section>
      </mt-index-list>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/Nav/TopNav";
// import city from "../../util/citydata.json"; //导入所有城市的JSON
import { makePy } from "../../util/pinying.js"; //导入插件获取所有城市中文的大写首字母
import { isArray } from "util";
import { IndexList } from "mint-ui";
export default {
  name: "City",
  data() {
    return {
      // title: "Current City: BEIJING",
      // cityData: cityData
      cityArr: [], //存放第二次筛选后所有城市名称
      citySort: [], //存放初始获取城市首字母大写的数组
      citySortArr: ["#"], //存放第二次筛选重复，不存在的城市首字母数组
      isShow: false,
      //输入框
      searchVal: "",
      ctShow: true,
      province: Object, //总数据
      arr: [], //存放初始筛选的城市名称  用来获取省会市
      Municipality: [], //省会市的名字
      country: [], //所有市的数据  //用来获取所有市
      allcountry: [], //所有市的名字
      city: [], //市对应的区数据
      area: [], //区(省会市+所有市+市辖区+所有区)
      specialCountry: ["北京市", "天津市", "重庆市", "上海市"], //市辖区
      amountCity: [], //所有的城市
      exDireCity: [], //所有市的市区县对应数据  排除市辖区
      allAmountCity: [], //所有城市  市+区/县  用于热门城市的显示
      direCity: [], //市辖区对应的市区县数据
      disArea: [], //用于展示的数据
      nowCity: "", //正在看的城市
      showCity: false //默认正在看的城市：郑州市
    };
  },
  components: {
    TopNav
  },
  methods: {
    //模糊搜索
    regListItem(val) {
      if (
        this.searchVal.toUpperCase() === val ||
        this.searchVal.trim() === ""
      ) {
        // this.ctShow = false;
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return true;
      }
    },
    //选择城市
    changeNav(e) {
      //默认false是北京市
      this.showCity = true;
      for (let i = 0; i < this.allAmountCity.length; i++) {
        //去掉市辖区
        if (this.allAmountCity[i].city === e.target.innerText) {
          //当点击的城市和数据中的城市名字一致时
          //对应的区/县
          this.disArea = this.allAmountCity[i].area;
          //对应的城市名称
          this.nowCity = this.allAmountCity[i].city;
        }
      }
      //先获取直辖市对应的区及县

      // this.$router.push({
      //   path: "/",
      //   query: {
      //     city: e.target.innerText
      //   }
      // })
    },
    //选择区/县
    getArea(e) {
      console.log(e.target);
      let _area = e.target.innerText;
      console.log(this.$refs.current);
      let _city = this.$refs.current.innerText;
      let _address = { city: _city, area: _area };
      console.log(_address);
      localStorage.setItem("address", JSON.stringify(_address));
    },
    //点击定位显示区县
    locationArea(e) {
      this.showCity = true;
      for (let i = 0; i < this.allAmountCity.length; i++) {
        //去掉市辖区
        if (this.allAmountCity[i].city === e.target.innerText) {
          console.log(e.target.innerText);
          //当点击的城市和数据中的城市名字一致时
          //对应的区/县
          this.disArea = this.allAmountCity[i].area;
          //对应的城市名称
          this.nowCity = this.allAmountCity[i].city;
        }
      }
    }
  },
  created() {
    this.$Api.newsApi
      .getAllRegionTree()
      .then(res => {
        if (res.status == 200) {
          //接受到的所有数据
          this.province = res.data;
          //省
          for (let i = 0; i < this.province.length; i++) {
            //获取市辖区的数据
            if (this.province[i].regionName === "北京市") {
              this.direCity[i] = {
                city: this.province[i].regionName,
                area: this.province[i].children[0].children
              };
              //北京市 市+区/县
              this.allAmountCity.push(this.direCity[i]);
            } else if (this.province[i].regionName === "天津市") {
              this.direCity[i] = {
                city: this.province[i].regionName,
                area: this.province[i].children[0].children
              };
              //北京市 市+区/县
              this.allAmountCity.push(this.direCity[i]);
            } else if (this.province[i].regionName === "上海市") {
              this.direCity[i] = {
                city: this.province[i].regionName,
                area: this.province[i].children[0].children
              };
              //北京市 市+区/县
              this.allAmountCity.push(this.direCity[i]);
            } else if (this.province[i].regionName === "重庆市") {
              this.direCity[i] = {
                city: this.province[i].regionName,
                area: this.province[i].children[0].children
              };
              //北京市 市+区/县
              this.allAmountCity.push(this.direCity[i]);
            }
            //用来获取省会市的数据arr
            this.arr.push(this.province[i].children[0]);
            //用来获取所有市的数据country
            this.country.push(this.province[i].children);
          }
          //获取所有市allcountry
          for (let n = 0; n < this.country.length; n++) {
            if (this.country[n].length > 1) {
              for (let w = 0; w < this.country[n].length; w++) {
                this.exDireCity[w] = {
                  city: this.country[n][w].regionName,
                  area: this.country[n][w].children
                };
                //所有市的名字 市+区/县
                this.allAmountCity.push(this.exDireCity[w]);
                //将所有市区信息 以（ 字母 - 市区名 ）的格式存在至数组中
                //所有市的名字  360
                this.allcountry.push(this.country[n][w].regionName);
              }
            } else if (this.country[n].length === 1) {
              for (let g = 0; g < this.country[n].length; g++) {
                this.exDireCity[g] = {
                  city: this.country[n][g].regionName,
                  area: this.country[n][g].children
                };
                //所有市的名字 市+区/县
                this.allAmountCity.push(this.exDireCity[g]);
              }
            }
          }
          //获取省会市  Municipality
          for (let j = 0; j < this.arr.length; j++) {
            // console.log(this.arr[j].regionName)
            if (this.arr[j] !== undefined) {
              for (let l in this.arr[j]) {
                if (l === "children") {
                  this.city.push(this.arr[j]["children"]);
                } else if (l === "regionName") {
                  //省下面对应的市
                  //因为有直辖市  所以需要判断一下
                  if (this.arr[j]["regionName"] !== "市辖区") {
                    this.Municipality.push(this.arr[j]["regionName"]);
                    // this.area.push(this.arr[j]["regionName"])
                  } else {
                    // this.direCity.push(this.arr[j]);
                  }
                }
              }
            }
          }
          //整合市辖区(直辖市4个)到区specialCountry
          for (let h = 0; h < this.specialCountry.length; h++) {
            this.area.push(this.specialCountry[h]);
            //所有的城市
            this.amountCity.push(this.specialCountry[h]);
          }
          //整合省会市到区Municipality
          // for(let b=0;b<this.Municipality.length;b++){
          //   this.area.push(this.Municipality[b]);
          //   //所有的城市
          //   this.amountCity.push(this.Municipality[b])
          // }
          //整合所有市到区allcountry
          for (let a = 0; a < this.allcountry.length; a++) {
            this.area.push(this.allcountry[a]);
            //所有的城市
            this.amountCity.push(this.allcountry[a]);
          }
          // //把省下面的市放到区里
          // this.area.push(this.country);
          //整合所有的区到 area
          for (let l = 0; l < this.city.length; l++) {
            for (let m = 0; m < this.city[l].length; m++) {
              this.area.push(this.city[l][m].regionName);
            }
          }

          // /**
          //  * 配置相关数据  this.amountCity所有市
          //  */
          for (let k in this.amountCity) {
            let cityKey = makePy(this.amountCity[k])[0].substring(0, 1); //获取每一个市区的首字母
            let cityValue = this.amountCity[k]; //获取所有市区
            this.citySort[cityKey] = cityKey; //利用对象特性，剔除重复的字母，并将剔除后的字母存进对象中

            //将所有市区信息 以（ 字母 - 市区名 ）的格式存在至数组中
            this.cityArr[k] = {
              key: cityKey,
              value: cityValue
            };
          }
          // /**
          //  * 将处理后的首字母数据对象，存放至数组中
          //  */
          for (let p in this.citySort) {
            this.citySortArr.push(this.citySort[p]);
          }
          /**
           * 将真实存在的市区首字母按A-Z进行排序
           */
          this.citySortArr = this.citySortArr.sort();
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    if (document.querySelector(".mint-indexsection-index").innerHTML === "#") {
      document.querySelector(".mint-indexsection-index").style.display = "none";
    }
  },
  updated() {
    //跳转到左侧
    let domArr = document.querySelectorAll("li[class=mint-indexlist-navitem]");
    domArr.forEach(item=>{
      //获取点击的对象 注册事件
      item.onclick=(e)=>{
        this.searchVal = e.target.innerText;
        this.regListItem()
      }
    })
  }
};
</script>
<style scoped>
.city {
  background-color: #fff;
}
.search {
  padding-top: 100px;
  width: 100%;
  height: 60px;
  /* background-color: pink; */
  padding: 100px 22px 70px;
  position: relative;
  text-align: center;
  border-bottom: 1px solid #d7d7d7;
  background-color: #fff;
  position: fixed;
  z-index: 9;
}
.search input {
  width: 100%;
  height: 52px;
  background: #ededed;
  /* border: 1px solid #1111; */
  /* background-color: pink; */
  /* color: #BFBFBF; */
  font-size: 10px;
  text-align: center;
  border-radius: 6px;
  padding: 0 165px;
}
.search input::-webkit-input-placeholder {
  color: #bfbfbf;
  font-size: 28px;
}
.search .search-btn {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 73%;
  transform: translateY(-50%);
  left: 21%;
}
.city .now-look {
  width: 100%;
  /* height: 80px; */
  /* background-color: pink; */
  line-height: 80px;
  padding: 200px 22px 0;
  background-color: #fff;
}
.city .now-look p {
  float: left;
  font-size: 36px;
  font-weight: bold;
  color: rgba(17, 17, 17, 1);
}
.city .now-look .current-local {
  /* margin-top: 50px; */
  background-color: #fafafa;
  padding: 30px 0;
}
.city .now-look .current-local p {
  font-size: 32px;
  font-weight: 600;
  color: rgba(153, 153, 153, 1);
  line-height: 28px;
  margin-top: 50px;
  margin-bottom: 20px;
  float: none;
}
.city .now-look .current-local .now-local {
  width: 200px;
  height: 68px;
  background-color: #fff;
  border: 2px solid #cccccc;
  /* margin-top: 100px; */
  text-align: center;
  /* padding: 0 0 20px; */
  border-radius: 6px;
  line-height: 60px;
}
.city .now-look .current-local .now-local img {
  width: 24px;
  height: 34px;
  vertical-align: middle;
  margin-right: 10px;
}
.city .now-look .current-local .now-local span {
  font-size: 28px;
  font-weight: 400;
  color: rgba(17, 17, 17, 1);
  line-height: 40px;
}
.city .now-look p.choose-xq {
  float: right;
  font-size: 28px;
  font-weight: 400;
  color: rgba(191, 191, 191, 1);
}
.city .now-look p.choose-xq .arrow-down {
  width: 26px;
  height: 26px;
  vertical-align: middle;
}
.city .now-look .reco-city {
  clear: both;
  padding: 0 20px 22px 0;
  overflow: hidden;
  width: 100%;
}
.city .now-look .reco-city div {
  width: 200px;
  height: 68px;
  float: left;
  border: 2px solid #cccccc;
  border-radius: 6px;
  text-align: center;
  line-height: 68px;
  width: 30%;
  margin: 0 10px;
  margin-top: 20px;
  /* margin-right:25px;
  margin-bottom:22px; */
}
.city .now-look .reco-city li {
  /* width: 200px;
  height: 68px;
  float: left;
  border: 2px solid #cccccc;
  border-radius: 6px;
  text-align: center;
  line-height: 68px; */
}
/* .city >>> .cube-index-list {
  height: 1054px;
  width: 100%;
} */
.mint-cell-title {
  flex: 0 0 auto;
}

.mint-indexsection-index {
  text-align: left;
}
.city >>> .mint-indexlist-navlist {
  background-color: #fff;
}
.city >>> .mint-indexlist-navlist .mint-indexlist-navitem {
  color: #ff3247;
  margin: 7px;
  font-weight: 400;
}
.city >>> .mint-cell-title {
  border-bottom: 1px solid #d6d6d6;
  padding: 16px 0;
}
.city >>> .mint-indexlist-nav {
  border: none;
}
.city >>> .mint-cell-text {
  font-size: 28px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 28px;
}
.city >>> .mint-indexsection-index {
  color: #ff3247;
  font-weight: 400;
}
.city >>> .mint-indexlist-navlist {
  height: 100%;
  position: fixed;
  width: 45px;
  top: 280px;
  right: -5px;
}
.city >>> .mint-indexlist-content {
  height: 100% !important;
  /* position: fixed; */
  width: 95%;
}
/* 搜索框 */
.city-search {
  position: absolute;
  top: 120px;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid red;
  background-color: #fff;
  /* z-index: 999; */
  /* display: none; */
}
</style>

