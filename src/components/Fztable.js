import React, { Component } from "react";
import "./style.scss";
import tripData from "./tripData.json";

class Fztable extends Component {
  static defaultProps = {
    count: {
      slide: 1, // [number]顯示滑動數
      show: 6 // [number]show幾格儲存格
    },
    speed: 0.3, // [number]移動時間
    whenClick: function($element) {
      console.log($element);
    }
  };

  constructor(props) {
    super(props);
    this.status = ["show_1", "show_2", "show_3", "show_4"]; //預設移動數
    this.state = {
      cross: [], //存放十字選取的陣列
      active: -1 //移動的class
    };
  }

  slideLeft = () => {
    console.log("slideLeft");
  };
  slideRight = () => {
    console.log("slideRight");
  };

  onClick = e => {
    let dateId = e.target.getAttribute("id");
    let dateRow = Math.floor(dateId / 7);
    let dateCol = dateId % 7;
    let row = [];
    let col = [];
    let both = [];
    this.props.whenClick(e.target);
    console.log("dateId", dateId);
    console.log("dateRow", dateRow);
    console.log("dateCol", dateCol);

    for (let i = 0; i < 7; i++) {
      row.push(dateRow * 7 + i); //等於每一格的位置
      col.push(7 * i + dateCol); //等於每一格的位置
    }
    both = [...row, ...col]; //合併陣列
    this.setState({
      cross: both,
      active: dateId
    });
    console.log(both);
  };

  render() {
    // console.log("tripData", tripData);
    return (
      <div className={`container d-flex ${"show_" + this.show}`}>
        <div className="d-flex">
          <div className={`slideBtn goLeft`} onClick={this.slideLeft}>
            <i className="fas fa-chevron-left" />
          </div>
          <div className={`slideBtn goRight`} onClick={this.slideRight}>
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
              // console.log("yearrArr1", yearrArr1);
              return (
                <div key={idx} className="d-flex flex-center">
                  {ele.goDate}
                  {yearrArr1}
                </div>
              );
            })}
          </div>
        </div>
        <div className="rightTable">
          {/* 滾動區域 */}
          <div className="scrolled">
            <div className="endDate d-flex flex-center">
              {tripData.date.map((ele, idx) => {
                // console.log("ele.data", ele.data[idx]["id"]);
                // console.log("ele.data", ele.data[idx]["backDate"]);
                const yearrArr = []; //存放,可以直接{yearrArr}帶入
                if (ele.data[idx]["backDate"] === "01/01(六)") {
                  yearrArr.push(
                    <p className="newYear" key={`${ele}${idx}`}>
                      2018
                    </p>
                  );
                }
                // console.log("yearrArr", yearrArr);
                return (
                  <div key={idx} className="d-flex flex-center">
                    {ele.data[idx]["backDate"]}
                    {yearrArr}
                  </div>
                );
              })}
            </div>
            {/* isNaN() 函式會判斷某個數值是不是NaN-->判斷price,'--','查看' */}
            <div className="priceShow d-flex">
              <div className="allPrice d-flex flex-center">
                {tripData.date.map((arr1, idx1) => {
                  return arr1.data.map((arr2, idx2) => {
                    let id = idx1 * 7 + idx2;
                    console.log("id", id);
                    let cross =
                      this.state.cross.indexOf(id) === -1 ? "" : "cross";
                    let active = id === this.state.active ? "active" : "";
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
                    // console.log(active);
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
      </div>
    );
  }
}

export default Fztable;
