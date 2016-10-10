import React from 'react';
import { ListGroup } from 'react-bootstrap';
import * as firebase from 'firebase';
import Litem from './litem';

var config = {
      apiKey: "AIzaSyCRpzldmrnwtOf7M_TBBNGFofyswZ2IifQ",
      authDomain: "smartdoor-2f29b.firebaseapp.com",
      databaseURL: "https://smartdoor-2f29b.firebaseio.com",
      storageBucket: "",
      messagingSenderId: "693048105512"
    };

firebase.initializeApp(config, "third");


export default class SelDoor extends React.Component {
    constructor() {
      super();
      this.state = {
        doors: ""
      } 
    }
    componentDidMount() {
      const rootRef = firebase.database().ref().child('doors');
      //doorRef.set(mem);
      rootRef.on('value' , snap => {
          this.setState( {
            doors: snap.val()
          }
          );
      });
    }
    render() {
        return (
          <div className="container">
            <p>
              select your door:
            </p>
            <ListGroup>
              { 

                Object.keys(this.state.doors).map(item => {
                  return <Litem chooseDoor={this.props.chooseDoor.bind(this, item)} item={item} key={item}/>;
                })
              }
            </ListGroup>
          </div>
        
        );
    }

}