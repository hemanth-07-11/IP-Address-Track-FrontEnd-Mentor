import React, { Component } from 'react';
import '../CSS/Main.css'
import {MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet';
import { Col, Row } from 'react-bootstrap';
import {  ReactComponent as Arrow } from '../Images/icon-arrow.svg';

const publicIp = require('public-ip');



const axios = require('axios');

var greenIcon = new L.Icon({
    iconUrl:'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', 
    iconSize: [30,32],
    iconAnchor: [22, 18],
});
  


class Main extends Component {
    constructor() {
        super()
        this.state = {
          ipaddress: null,
          position: null,
          lat: null,
          lng: null,
          map: null,
          ip:null,
          loc: null,
          time:null,
          isp:null
        }


        this.getIP=this.getIP.bind(this)
        this.getMyIP=this.getMyIP.bind(this)

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    handleChange(event) {
        this.setState({ipaddress: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault()
        this.getIP();
        
    }

    componentDidMount(){
        this.getMyIP();
    }

    async  getMyIP() {
        let result = await publicIp.v4();
        this.setState({
            ipaddress: result
        })

        this.getIP();

    }

    async getIP() {
        let data = await axios
          .get(`https://geo.ipify.org/api/v1?apiKey=at_egY0j06KGrROA3HnYtY6LJ73xFWYd&ipAddress=${this.state.ipaddress}`)
          .then(function(data) {
            console.log(data);
            return data ;
            
          })

        this.setState({
              lat:data.data.location.lat,
              lng:data.data.location.lng,
              ip: data.data.ip,
              isp:data.data.isp,
              time: "UTC" + " " + data.data.location.timezone,
              loc:data.data.location.city + ", " +data.data.location.region + ", " + data.data.location.country  ,
              position:[data.data.location.lat, data.data.location.lng]
              
          })


        const {map} = this.state;
        if (map) map.flyTo(this.state.position);

        this.setState({
            ipaddress:""
        })
          
      }


        
    render() {
        return (
            <div id="main-div" >
                <div id="navbar">

                    <h2>IP Address Tracker</h2>
                    <form  type="submit" onSubmit={ this.handleSubmit }>
                        <input type="text" placeholder="Search for any IP address or domain" value={this.state.ipaddress} onChange={this.handleChange} />
                        <button>< Arrow/></button> 
                    </form>
                </div>

                <div className="displaybox" >
                    <Row className="rowstyle" style={{paddingBottom:"20px",}}>
                        <Col md  className="cols bods ">
                            <p>IP ADDRESS</p>
                            <h4>{this.state.ip}</h4>
                        </Col>

                        <Col md className="cols bods">
                            <p>LOCATION</p>
                            <h4>{this.state.loc}</h4>
                        </Col>

                        <Col md className="cols bods">
                            <p>TIMEZONE</p>
                            <h4>{this.state.time}</h4>
                        </Col>

                        <Col md style={{marginRight:"10px"}} className="cols">
                            <p>ISP</p>
                            <h4>{this.state.isp}</h4>
                        </Col>
                    </Row>
                </div>


                <MapContainer id="maps" center={{ lat: 51.505, lng: -0.09 }} zoom={5} whenCreated={map => this.setState({ map })}>
                    <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />

                    {

                    this.state.position === null ? null : (
                        <Marker icon={greenIcon} position={this.state.position}/>  )             

                    
                    }

                    
                    
                </MapContainer>
            </div>
            
        );
    }
}

export default Main;