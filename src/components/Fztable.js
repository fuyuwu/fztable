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
    this.state = {
      column: "slide0", //存slide的Class
      cross: [], //存放十字選取的陣列
      active: -1, //是否加上active的class
      arrowLeft: 0, //左按鈕狀態
      arrowRight: 1, //右按鈕狀態
      scroll_position: 0, //捲動框位置
      transition: this.props.speed + "s",
      moveleft: 0 + "%",
      times: 1, //儲存點擊次數
      showClass: ["show1", "show2", "show3", "show4"],
      slideClass: ["slide1", "slide2", "slide3", "slide4"]
    };
  }

  slideLeft = () => {
    console.log("slideLeft");
    const slide = this.props.count.slide;
    const show = this.props.count.show;
    let scroll_r;
    let clickTimes = this.state.times - 1; //點擊次數
    let arrow_l_show;
    const { column } = this.state;
    if (column === "slide1") {
      this.setState({
        column: "slide0",
        arrow_r_show: 1
      });
      console.log("column", column);
    } else {
      this.setState({
        column: "slide1",
        arrow_r_show: 1
      });
    }

    if (this.state.times > 2) {
      arrow_l_show = 1;
      clickTimes = this.state.times - 1;
      scroll_r = this.state.scroll_position - (100 / show) * slide;
    } else if (this.state.times === 2) {
      arrow_l_show = 1;
      scroll_r = 0;
      clickTimes = 1;
    }
    if (clickTimes === 1) {
      arrow_l_show = 0;
    }

    console.log("clickTimes", clickTimes, "times", this.state.times);
    this.setState({
      arrowLeft: arrow_l_show,
      arrowRight: 1,
      scroll_position: scroll_r,
      transition: this.props.speed + "s",
      moveleft: -scroll_r + "%",
      times: clickTimes
    });
  };

  slideRight = () => {
    console.log("slideRight");
    const slide = this.props.count.slide;
    const show = this.props.count.show;
    let scroll_r; //向右移動
    let clickTimes = this.state.times - 1; //點擊次數
    let arrow_r_show;
    let rightClick = Math.floor((7 - show) / slide);
    const { column } = this.state;
    if (column === "slide0") {
      this.setState({
        column: "slide1",
        arrow_r_show: 1,
        arrow_l_show: 0
      });
    } else {
      this.setState({
        arrow_l_show: 1,
        column: "slide2"
      });
    }
    console.log("column", column);
    if (this.state.times <= rightClick) {
      clickTimes = this.state.times + 1;
      scroll_r = this.state.scroll_position + (100 / show) * slide;
      arrow_r_show = 1;
    } else if (this.state.times > rightClick) {
      clickTimes = rightClick + 1;
      scroll_r = (100 / show) * (7 - show);
      arrow_r_show = 1;
    }
    if (this.state.times === rightClick) {
      arrow_r_show = 0;
    }
    console.log(
      "clickTimes",
      clickTimes,
      "rightClick",
      rightClick,
      "times",
      this.state.times
    );
    console.log("scroll_r", scroll_r);

    this.setState({
      scroll_position: scroll_r,
      transition: this.props.speed + "s",
      moveleft: -scroll_r + "%",
      arrowRight: arrow_r_show,
      arrowLeft: 1,
      times: clickTimes
    });
  };
  onClick = e => {
    let dateId = e.currentTarget.getAttribute("id");
    let dateRow = Math.floor(dateId / 7); //縱
    let dateCol = dateId % 7; //橫
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

  componentDidMount() {
    const showList = this.props.count.show - 1;
    const slideList = this.props.count.slide - 1;
    this.setState({
      showClass: this.state.showClass[showList],
      slideClass: this.state.slideClass[slideList]
    });
  }

  render() {
    const { show, slide } = this.props.count;
    const { slideClass, showClass, column } = this.state;
    let arrowLeft = this.state.arrowLeft === 0 ? "d-none" : "";
    let arrowRight = this.state.arrowRight === 0 ? "d-none" : "";
    let transition = Number(this.props.speed) + "s";

    console.log("transition", transition);
    return (
      <div className="container d-flex">
        <div>
          <div className={`goLeft ${arrowLeft}`} onClick={this.slideLeft}>
            <i className="fas fa-chevron-left" />
          </div>
          <div className={`goRight ${arrowRight}`} onClick={this.slideRight}>
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
          <div className={`scrolled ${showClass} ${column} ${transition}`}>
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
            <div className="priceShow d-flex ">
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
