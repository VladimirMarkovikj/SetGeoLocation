import React, { Component } from "react";

import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import axios from "axios";

export class SetGeoLocation extends Component {
  state = {
    marker: {
      lat: 0,
      lng: 0,
    },
    initialCenter: {
      lat: 0,
      lng: 0,
    },
    showInfoWindow: false,
    selectedAddress: {
      country: "",
      city: "",
      state: "",
      village: "",
      town: "",
      road: "",
      house_number: "",
    },
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCurrentPosition);
    }
  }

  getCurrentPosition = (position) => {
    const { latitude, longitude } = position.coords;
    const initialCenter = {
      lat: latitude,
      lng: longitude,
    };
    this.setState({ initialCenter });
  };

  onMapClicked = async (e, map, coord) => {
    const { lat, lng } = coord.latLng;
    await this.setMarkerLocation(lat(), lng());
  };

  onMarkerClicked = () => {
    axios
      .post(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.state.marker.lat}&lon=${this.state.marker.lng}&zoom=18&addressdetails=1`
      )
      .then((data) => {
        console.log(data.data.address);
        const {country,city,state,village, town, road, house_number} = data.data.address
        const selectedAddress = {
          country: country,
          city: city,
          state: state,
          village: village,
          town: town,
          road: road,
          house_number: house_number,
        };
        this.setState({showInfoWindow: true, selectedAddress});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setMarkerLocation = (lat, lng) => {
    const mark = {
      lat: lat,
      lng: lng,
    };
    this.setState({ marker: mark },()=>{this.props.setLocation(mark)});
  };

  onInfoWindowClosed = () => {
    this.setState({ showInfoWindow: false });
  };

  render() {
    return (
      <React.Fragment>
        <Map
          google={this.props.google}
          zoom={14}
          onClick={this.onMapClicked}
          center={this.state.initialCenter}
        >
          <Marker
            name={"Current location"}
            position={{
              lat: this.state.marker.lat,
              lng: this.state.marker.lng,
            }}
            onClick={this.onMarkerClicked}
          />
          <InfoWindow
            visible={this.state.showInfoWindow}
            position={{
              lat: this.state.marker.lat,
              lng: this.state.marker.lng,
            }}
            onClose={this.onInfoWindowClosed}
          >
            <div>
              <h1>
                More info
              </h1>
              <div>Latitude: {this.state.marker.lat}</div>
              <div>Longitude: {this.state.marker.lng}</div>
              {this.state.selectedAddress.country && <div>Country: {this.state.selectedAddress.country}</div>}
              {this.state.selectedAddress.state && <div>State / Region: {this.state.selectedAddress.state}</div>}
              {this.state.selectedAddress.city && <div>City: {this.state.selectedAddress.city}</div>}
              {this.state.selectedAddress.town && <div>Town: {this.state.selectedAddress.town}</div>}
              {this.state.selectedAddress.village && <div>Village: {this.state.selectedAddress.village}</div>}
              {this.state.selectedAddress.road && <div>Road: {this.state.selectedAddress.road}</div>}
              {this.state.selectedAddress.house_number && <div>House number: {this.state.selectedAddress.house_number}</div>}
            </div>
          </InfoWindow>
        </Map>
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "",
})(SetGeoLocation);
