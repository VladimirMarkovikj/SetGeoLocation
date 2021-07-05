import React, { Component } from 'react';
import SetGeoLocation from "./SetGeoLocation/SetGeoLocation"
import './App.css';

class App extends Component {
  state={
    locationLatLng:{
      lat: 0,
      lng: 0,
    }
  }

  setLocation = (locationLatLng) => {
    this.setState({locationLatLng})
  }
  render() {
    return (
      <div className="App">
       <SetGeoLocation setLocation={this.setLocation} />
      </div>
    );
  }
}

export default App;
