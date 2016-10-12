import React from 'react';
import * as firebase from 'firebase';
import {  Panel, Button,  Grid, Row, Col, Table, Modal } from 'react-bootstrap';
import Memos from './memos';


var config = {
      apiKey: "AIzaSyCRpzldmrnwtOf7M_TBBNGFofyswZ2IifQ",
      authDomain: "smartdoor-2f29b.firebaseapp.com",
      databaseURL: "https://smartdoor-2f29b.firebaseio.com",
      storageBucket: "",
      messagingSenderId: "693048105512"
    };

firebase.initializeApp(config);

var Forecast = require('react-forecast');



export default class Main extends React.Component {
    constructor() {
      super();
      this.state = {
        memos: "",
        status: {
          ip: '',
          time: '',
          doorimg: './lock.png',
          doorstatus: ''
        },
        online: 'offline',
        doorbutton: 'Open',
        lastmove: false,
        move: false,
        showModal: false
      } 
    }
    componentDidMount() {
      const rootRef = firebase.database().ref().child('memos');
      const doorRef = rootRef.child(this.props.door);
      //doorRef.set(mem);
      doorRef.on('value' , snap => {
          this.setState( {
            memos: snap.val()
          }
          );

      });
      const rootRef2 = firebase.database().ref().child('doors');
      const doorRef2 = rootRef2.child(this.props.door);
      //doorRef.set(mem);
      doorRef2.on('value' , snap => {
          this.setState( {
            status: snap.val()
          }
          );

      });
      this.timer = setInterval( () => {
        var d = new Date();
        var online =  ((d.getTime() - this.state.status['time'] ) > 10000 ) ? "offline" : "online";
        var doorbutton = (this.state.status['doorstatus'] === "Close" ) ? "Unlock" : "Lock";
        var doorimg = (this.state.status['doorstatus'] === "Close" ) ? "./lock.png" : "./unlock.png";
        if (this.state.status['doorstatus'] === "Middle" ) doorimg = "./error.png";
        var doorbuttondisabled = false;
        if ((this.state.status['doorstatus'] === "Locking") || (this.state.status['doorstatus'] === "Unlocking" )) {
          doorbutton = this.state.status['doorstatus'];
          doorbuttondisabled = true;
          doorimg = "./loading.gif"
        }
        
        var move = (this.state.status['move'] === undefined) ? "false" : this.state.status['move'] ;
        var notification = (this.state.status['notification'] === undefined) ? "false" : this.state.status['notification'];
        var lastnotification = this.state.notification;
        var lastmove = this.state.move;
        this.setState( {
         online: online,
         doorbutton: doorbutton,
         doorbuttondisabled: doorbuttondisabled,
         doorimg: doorimg,
         lastmove: (lastmove === undefined) ? "false" : lastmove,
         move: move,
         notification: notification,
         lastnotification: (lastnotification === undefined) ? false : lastnotification
        });
        if ( ((lastmove !== move) && (notification === "false")) ||  lastnotification !== notification ) {
          this.setState( {
            showModal: (move === "true" ) ? true : ((notification === "true") ? true : false),
            modaltitle: (notification === "true") ? this.state.status['notification-title'] : "Dont Forget!" ,
            modalbody: (notification === "true") ? <div> {this.state.status['notification-msg']} </div> : <Memos memos={this.state.memos} doorid={this.props.door} /> 
          });

        }
      }, 50);
    }

    componentWillUnmount() {
         clearInterval(this.timer);
        this.timer = false;
    }
    close() {
      this.setState({ showModal: false });
    }
    writecom(command) {
      const rootRef2 = firebase.database().ref().child('doors');
      const doorRef2 = rootRef2.child(this.props.door);
      doorRef2.child('todo').set(command);
      doorRef2.child('todo-name').set(this.props.name);
      
    }
    open() {
      this.setState({ showModal: true });
    }
    render() {
        return (
          <div>
          <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modaltitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.modalbody}

           </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Close</Button>
          </Modal.Footer>
          </Modal>         
          <Grid>
          <Row className="show-grid">

            </Row>
            { (() => {
              if (this.state.online === "offline" ) 
                  return <div>{this.props.door} door is: <div className='App-red'> Offline</div> please check door connectivity.</div>;
               else
                  return (            
                    <Row className="show-grid">
                    <Col  xs={12} sm={6} md={4}>
                    <Panel header="Control" className="App-aligntextleft">
                    <table className="App-filltable">
                      <tbody>
                      <tr>
                        <td>

                                <div>
                            <p>
                              <Button bsStyle="primary" bsSize="large" disabled={this.state.doorbuttondisabled} onClick={this.writecom.bind(this, this.state.doorbutton)}>{this.state.doorbutton} Door</Button>
                            </p>
                            <p>
                              <Button bsStyle="danger" bsSize="large"  onClick={this.writecom.bind(this, "Emergency")}>Emergency</Button>
                            </p>
                                  </div>
                        </td>
                        <td>
                          <img src={this.state.doorimg} className="App-lock" alt="door state" />
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </Panel>
                  </Col>
                  <Col xs={12} sm={6} md={4}>
                  <Panel header="information" className="App-aligntextleft">
                    <Table condensed>
                    <tbody>
                    <tr>
                      <td> door connectivity: </td>
                      <td>            { (() => {
                          if (this.state.online === "offline" ) 
                            return <div className='App-red'> Offline</div>;
                          else
                            return <div className='App-green'> Online</div>;
                        })()
                        } 
                          
                      </td>
                    </tr>
                    <tr>
                      <td> smoke detector </td>
                      <td>  {this.state.status['smokedetect']} </td>
                    </tr>
                    <tr>
                      <td> Alarm is </td>
                      <td>  {this.state.status['alarm']} </td>
                    </tr>
                    </tbody>
                  </Table>
                  </Panel>
                  </Col>
                  <Col xsHidden smHidden md={4}>
                  <Panel header="additional">
                  </Panel>
                  </Col>
                  </Row>
              )})()
                } 
          <Row className="show-grid">
            <Col xsHidden smHidden md={6}>
           <Panel header="forcast"  eventKey="1">
            <Forecast latitude={32.7940} longitude={34.9896} name='Haifa' units='ca' />
          </Panel>
            </Col>
            <Col xs={12} md={6}>
          <Panel header="Memos" eventKey="2">
            <Memos 
              memos={this.state.memos} 
              doorid={this.props.door} />
          </Panel>
            </Col>
            </Row>
            </Grid>
          
          </div>
        );
    }
}