// document.querySelector( "#subscriber-count" ).textContent

import React, { Component } from "react";

class Stats extends Component {
  componentDidMount() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.youtube.com/manorisms", true);
    xhr.onreadystatechange = function() {
      console.log("onreadystatechange");
      if (xhr.readyState == 4) {
        var response = xhr.response;
        console.log(xhr.readyState, xhr.response);
      }
    };
    xhr.send();
  }
  updateTime = () => {
    this.setState({ currentTime: new Date() });
    window.setTimeout(this.updateTime, 1000);
  };
  render() {
    return (
      <div className="Stats">
        <header>Stats</header>
      </div>
    );
  }
}

export default Stats;
