import React, { Component } from "react";
import backgroundImage from "./background-image.jpg";
import Stats from "./Stats";

import "./App.css";

const CLIENT_ID =
  "506b6448142e0ece81e4c0aabdb4a744f0d45d1f6b9894f2dc699396bebfff9a";
const query = "landscape";

const getTime = date =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "numeric" });
const getGreeting = date => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 20) {
    return "Good evening";
  } else if ((hour >= 20 && hour <= 23) || hour < 5) {
    return "Good night";
  }
};

// https://developer.yahoo.com/weather/
// https://unsplash.com/oauth/applications/25046
// https://unsplash.com/documentation#get-a-random-photo

const persisteState = newState => {
  let oldState = window.localStorage.getItem("state") || "{}";
  oldState = JSON.parse(oldState);
  const updatedState = Object.assign({}, oldState, newState);
  window.localStorage.setItem("state", JSON.stringify(updatedState));
};

const hydrateState = () => {
  let state = window.localStorage.getItem("state") || "{}";
  state = JSON.parse(state);
  let hydratedState = Object.assign(
    {
      lastFetched: null,
      currentTime: new Date(),
      isEditing: !state.name,
      name: "",
      backgroundImage,
      photographer: {
        name: "Ales Krivec",
        site: "https://unsplash.com/@aleskrivec"
      }
    },
    state
  );
  hydratedState.lastFetched =
    hydratedState.lastFetched !== null
      ? new Date(hydratedState.lastFetched)
      : hydratedState.lastFetched;
  hydratedState.currentTime = new Date();
  return hydratedState;
};

class App extends Component {
  state = hydrateState();
  componentDidMount() {
    const { lastFetched } = this.state;
    if (lastFetched === null) {
      console.log("first day... use default image");
      persisteState({ lastFetched: Date.now() });
    } else if (new Date().toDateString() !== lastFetched.toDateString()) {
      console.log("next day... get new image");
      this.updateBackground();
    } else {
      console.log("same day... use same image");
    }
    this.updateTime();
  }
  updateBackground = () => {
    window
      .fetch(
        `https://api.unsplash.com/photos/random/?query=${query}&orientation=landscape&&client_id=${CLIENT_ID}`
      )
      .then(res => res.json())
      .then(res => {
        const state = {
          backgroundImage: res.urls.full,
          photographer: {
            name: res.user.name,
            site: res.links.html
          },
          lastFetched: Date.now(),
          currentTime: Date.now()
        };
        persisteState(state);
        this.setState(state);
      });
  };
  updateTime = () => {
    this.setState({ currentTime: new Date() });
    window.setTimeout(this.updateTime, 1000);
  };
  handleChange = e => {
    this.setState({ name: e.target.value });
  };
  handleKeyPress = e => {
    if (this.state.name && e.key === "Enter") {
      persisteState({ name: this.state.name });
      this.setState({ isEditing: false });
    }
  };
  handleBlur = e => {
    if (this.state.name) {
      persisteState({ name: this.state.name });
      this.setState({ isEditing: false });
    }
  };
  handleEdit = e => {
    this.setState({ isEditing: true });
  };
  handleRefresh = e => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    persisteState({ lastFetched: yesterday.getTime() });
    this.updateBackground();
  };
  render() {
    const { isEditing, name, backgroundImage, photographer } = this.state;
    const date = new Date();
    const [time, hour12] = getTime(date).split(" ");

    return (
      <div
        className="App"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover"
        }}
      >
        <div className="App-refresh" onClick={this.handleRefresh}>
          <i>♺</i>
        </div>
        <div className="App-central">
          <h1 className="App-time">
            <span>{time}</span> <span>{hour12}</span>
          </h1>
          <h2 className="App-greeting">
            {isEditing ? (
              <label>
                Hello, what's your name?
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                  onBlur={this.handleBlur}
                />
              </label>
            ) : (
              <div onDoubleClick={this.handleEdit}>
                {getGreeting(date)}, {name}
              </div>
            )}
          </h2>
        </div>
        <div className="App-photographer">
          Photo by{" "}
          <a
            href={`${photographer.site}?utm_source=tabard&utm_medium=referral`}
          >
            {photographer.name}
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/?utm_source=tabard&utm_medium=referral">
            Unsplash
          </a>
        </div>
      </div>
    );
  }
}

export default App;
