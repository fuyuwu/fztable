import React, { Component } from "react";
import "./style.scss";
import tripData from "./tripData.json";

class Fztable extends Component {
  static defaultProps = {
    count: {
      slide: 1, // [number]顯示滑動數
      show: 3 // [number]show幾格儲存格
    },
    speed: 0.3, // [number]移動時間
    whenClick: function($element) {
      console.log($element);
    }
  };
  constructor(props) {
    super(props);
    this.status = ["show1", "show2", "show3", "show4"];
    this.state = {
      cross: [], //存放十字選取的陣列
      active: -1, //是否加上active的class
      arrowLeft: 0, //左按鈕狀態
      arrowRight: 1, //右按鈕狀態
      scroll_position: 0, //捲動框位置
      scroll_style: {
        transition: this.speed + "s",
        left: 0
      }
    };
  }
  init = () => {
    if (
      Number(this.props.count.show) > 0 &&
      Number(this.props.count.show) < 5
    ) {
      var showList = this.status[this.props.count.show - 1];
      return showList;
    }
  };

  state = {
    clickTimes: 0, //已按幾次
    goRight: 1, //箭頭右
    goLeft: 0, //箭頭左 displayNone
    speed: 0
  };

  slideLeft = () => {
    console.log("slideLeft");
    const slide = this.props.count.slide;
    const show = this.props.count.show;
    let scroll_position = this.state.scroll_position - (100 / show) * slide;
    console.log("左移移動框位置:", scroll_position);
    let arrowLeft; //判斷左箭頭
    let moveLeft; //紀錄左移移動數
    let clickCount = this.state.clickTimes; //點擊次數
    console.log("clickCount", clickCount);

    if (this.state.clickTimes !== 0) {
      moveLeft = scroll_position;
      clickCount = this.state.clickTimes + 1;
      arrowLeft = 1;
      if (clickCount === 0) {
        moveLeft = scroll_position;
        arrowLeft = 0;
      } else if (this.state.clickTimes === 0) {
        moveLeft = scroll_position;
        arrowLeft = 0;
      }
    }

    this.setState({
      scroll_position: scroll_position,
      scroll_style: {
        transition: this.props.speed + "s",
        left: -scroll_position + "%"
      },
      clickTimes: clickCount,
      arrowLeft: 1
    });
    console.log("scroll_position", scroll_position);
  };

  slideRight = () => {
    console.log("slideRight");
    const slide = this.props.count.slide;
    const show = this.props.count.show;
    console.log(this.props.speed);
    let scroll_position = this.state.scroll_position + (100 / show) * slide;
    console.log("右移移動框位置:", scroll_position);

    let moveRight; //紀錄右移移動數
    let clickCount = this.state.clickTimes; //點擊次數

    if (scroll_position >= 0) {
      scroll_position = scroll_position;
      this.setState({
        arrowLeft: 1
      });
      console.log("scroll_positio到底是:", scroll_position);
    }
    this.setState({
      scroll_position: scroll_position,
      scroll_style: {
        transition: this.props.speed + "s",
        left: -scroll_position + "%"
      }
    });
  };
  onClick = e => {
    let dateId = e.currentTarget.getAttribute("id");
    let dateRow = Math.floor(dateId / 7);
    let dateCol = dateId % 7;
    let row = [];
    let col = [];
    let both = [];
    this.props.whenClick(e.currentTarget);
    console.log("dateId", dateId);
    console.log("dateRow", dateRow);
    console.log("dateCol", dateCol);

    for (let i = 0; i < 7; i++) {
      row.push(dateRow * 7 + i); //等於每一格的位置
      col.push(7 * i + dateCol); //等於每一格的位置
    }
    both = [...row, ...col]; //合併陣列
    console.log("dateId", dateId, "is", typeof dateId); //string
    this.setState({
      cross: both,
      active: Number(dateId)
    });
    console.log(both);
  };

  render() {
    let arrowLeft = this.state.arrowLeft === 0 ? "d-none" : "";
    let arrowRight = this.state.arrowRight === 0 ? "d-none" : "";
    let showList = this.init();
    return (
      <div className="container d-flex">
        <div>
          <div
            className={`slideBtn goLeft ${arrowLeft}`}
            onClick={this.slideLeft}
          >
            <i className="fas fa-chevron-left" />
          </div>
          <div
            className={`slideBtn goRight ${this.state.arrowRight}`}
            onClick={this.slideRight}
          >
            <i className="fas fa-chevron-right" />
          </div>
        </div>
        <div className="leftTable">
          <div className="pd-4 topBg">
            <p className="text-right">回程</p>
            <p className="text-left">去程</p>
          </div>
          <div className="dayOnly leftBg">
            {/* 直排日期(去程) */}
            {tripData.date.map((ele, idx) => {
              // console.log("ele", ele);
              const yearrArr1 = []; //存放,可以直接{yearrArr}帶入
              if (ele.goDate === "01/01(六)") {
                yearrArr1.push(
                  <p className="newYear" key={`${ele}${idx}`}>
                    2018
                  </p>
                );
              }
              return (
                <div key={idx} className="d-flex flex-center">
                  {ele.goDate}
                  {yearrArr1}
                </div>
              );
            })}
          </div>
        </div>
        <div className={"rightTable"}>
          {/* 滾動區域!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
          <div
            className={`scrolled ${showList}`}
            style={this.state.scroll_style}
          >
            <div className="endDate d-flex flex-center">
              {tripData.date.map((ele, idx) => {
                // console.log("ele.data", ele.data[idx]["id"]);
                const yearrArr = []; //存放,可以直接{yearrArr}帶入
                if (ele.data[idx]["backDate"] === "01/01(六)") {
                  yearrArr.push(
                    <p className="newYear" key={`${ele}${idx}`}>
                      2018
                    </p>
                  );
                }
                return (
                  <div key={idx} className={`d-flex flex-center`}>
                    {ele.data[idx]["backDate"]}
                    {yearrArr}
                  </div>
                );
              })}
            </div>
            {/* isNaN() 函式會判斷某個數值是不是NaN-->判斷price,'--','查看' */}
            <div className="priceShow d-flex">
              {tripData.date.map((arr1, idx1) => {
                return arr1.data.map((arr2, idx2) => {
                  let id = idx1 * 7 + idx2;
                  // console.log("id", id);
                  let cross =
                    this.state.cross.indexOf(id) === -1 ? "" : "cross";
                  // console.log("idx1", idx1);
                  // console.log("idx2", idx2);
                  // console.log("id", id);
                  let active = id === this.state.active ? "active" : "";
                  // console.log("id:", id, "active:", this.state.active); 除bug最好的方法就是console.log

                  const cheaper = [];
                  if (arr2.isCheaper === true) {
                    cheaper.push(
                      <label className="cheaper" key={idx2}></label>
                    );
                  }
                  let strPrice =
                    String(arr2.price) === " 一 一 " ? (
                      " 一 一 "
                    ) : (
                      <span>查看</span>
                    );
                  let localeString =
                    Number(arr2.price).toLocaleString() === "非數值"
                      ? arr2.price
                      : Number(arr2.price).toLocaleString();

                  // console.log(strPrice);
                  return (
                    <div
                      className={`cellInfo d-flex flex-center ${cross} ${active}`}
                      key={idx2}
                      id={id}
                      onClick={this.onClick}
                    >
                      <span className={isNaN(arr2.price) ? "" : "price"}>
                        {Number(arr2.price).toLocaleString()
                          ? localeString
                          : strPrice}
                        {cheaper}
                      </span>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Fztable;
