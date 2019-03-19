import React, { Component } from "react";
import "./App.css";
import Sound from "react-sound";

var taskTime = 1200;
var breakTime = 300;

class App extends Component {
  state = {
    timeRemaining: taskTime,
    isPaused: false,
    hasStarted: false,
    breakMode: false
  };

  // Setup

  componentDidMount() {}

  tick() {
    if (!this.state.isPaused && this.state.hasStarted) {
      if (this.state.timeRemaining !== 0) {
        this.setState({ timeRemaining: this.state.timeRemaining - 1 });
      }
    }
  }

  // Actions

  startTicking() {
    this.setState({ hasStarted: true });

    setInterval(() => {
      this.tick();
    }, 1000);
  }

  restartTimer(breakMode) {
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
      timeRemaining: timeRemaining
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

  render() {
    let controlButton;

    if (!this.state.hasStarted) {
      controlButton = (
        <button
          onClick={() => this.startTicking()}
          class="p-2 bg-grey-light rounded"
        >
          Start
        </button>
      );
    } else {
      if (this.state.timeRemaining !== 0) {
        controlButton = (
          <button
            onClick={() => this.togglePause()}
            class="p-2 bg-grey-light rounded"
          >
            {this.pauseButtonText()}
          </button>
        );
      } else {
        if (this.state.breakMode) {
          controlButton = (
            <button onClick={() => this.restartTimer(false)}>Start task</button>
          );
        } else {
          controlButton = (
            <button onClick={() => this.restartTimer(true)}>Start break</button>
          );
        }
      }
    }

    let restartButton;

    if (this.state.isPaused && this.state.hasStarted) {
      restartButton = (
        <button
          onClick={() => this.restartTimer(this.state.breakMode)}
          class="p-2 bg-red rounded text-white ml-2"
        >
          Restart
        </button>
      );
    }

    let statusText;

    if (this.state.breakMode) {
      statusText = "Break time!";
    } else {
      statusText = "Do some work!";
    }

    let ifTicking;

    if (this.state.hasStarted && !this.state.isPaused) {
      ifTicking = <Sound url="./sounds/tick.wav" playStatus={"PLAYING"} />;
    }

    return (
      <div className="flex flex-col items-center">
        <div>{statusText}</div>
        <div className="text-5xl py-4">{this.hhmmss(this.state.timeRemaining)}</div>
        <div className="flex flex-row items-center">
          {controlButton}
          {restartButton}
        </div>
        {ifTicking}
      </div>
    );
  }
}

export default App;
