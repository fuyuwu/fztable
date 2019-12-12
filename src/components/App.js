import React, { Component } from "react";
import Fztable from "./Fztable";

class App extends Component {
  state = {
    date: []
  };
  componentDidMount() {
    fetch("./tripData.json", {
      headers: {
        Accept: "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        this.setState({ data: responseData });
        return responseData;
      });
  }

  render() {
    return (
      <Fztable
        tripData={this.state.data}
        count={{ slide: 4, show: 3 }}
        speed={0.3}
        whenClick={element => {
          console.log(element);
        }}
      ></Fztable>
    );
  }
}

export default App;
