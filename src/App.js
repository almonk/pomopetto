import React, { Component } from "react";
import Sound from "react-sound";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";

var taskTime = 1200;
var breakTime = 300;
// eslint-disable-next-line
var interval;

class App extends Component {
  state = {
    timeRemaining: taskTime,
    isPaused: false,
    hasStarted: false,
    breakMode: false,
    soundTickingPlaying: false
  };

  // Setup

  componentDidMount() {}

  componentDidUpdate() {
    document.title = this.hhmmss(this.state.timeRemaining);
  }

  tick() {
    if (!this.state.isPaused && this.state.hasStarted) {
      if (this.state.timeRemaining !== 0) {
        this.setState({ timeRemaining: this.state.timeRemaining - 1 });
      }
    }
  }

  // Actions

  startTicking() {
    this.setState({
      hasStarted: true,
      soundTickingPlaying: "PLAYING"
    });

    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  restartTimer(breakMode) {
    clearInterval(this.interval);

    let timeRemaining;
    if (breakMode) {
      timeRemaining = breakTime;
    } else {
      timeRemaining = taskTime;
    }

    this.setState({
      breakMode: breakMode,
      isPaused: false,
      hasStarted: false,
      timeRemaining: timeRemaining,
      soundRisePlaying: false,
      soundTickingPlaying: false
    });
  }

  togglePause() {
    this.setState({ isPaused: !this.state.isPaused });
  }

  pauseButtonText() {
    var text = "Pause";

    if (this.state.isPaused) {
      text = "Resume";
    }

    return text;
  }

  // Time utils

  pad(num) {
    return ("0" + num).slice(-2);
  }

  hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }

  // Inline components
  controlButtons() {
    var btnClasses = "bg-grey-light text-black text-sm rounded px-4 py-2"
    if (!this.state.hasStarted) {
      return (
        <div className="flex flex-row">
          <button className={btnClasses} onClick={() => this.startTicking()}>Start</button>
        </div>
      );
    }

    if (this.state.hasStarted && !this.state.isPaused) {
      return (
        <div className="flex flex-row">
          <button className={btnClasses} onClick={() => this.togglePause()}>
            Pause
          </button>
        </div>
      );
    }

    if (this.state.hasStarted && this.state.isPaused) {
      return (
        <div className="flex flex-row">
          <button className={btnClasses} onClick={() => this.togglePause()}>Resume</button>
          <button className={btnClasses + " ml-2 bg-red text-white"} onClick={() => this.restartTimer()}>Restart</button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="flex flex-col items-center shadow-md px-8 py-8 pb-6 rounded-lg">
        <CircularProgressbar
          className="h-48 w-48 mb-4"
          text={this.hhmmss(this.state.timeRemaining)}
          percentage={(this.state.timeRemaining / taskTime) * 100}
          initialAnimation={true}
        />
        <div className="flex flex-row items-center">
          {this.controlButtons()}
        </div>
        <Sound
          url="./sounds/tick.wav"
          playStatus={this.state.soundTickingPlaying}
        />
      </div>
    );
  }
}

export default App;
