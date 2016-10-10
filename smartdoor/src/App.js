import React, { Component } from 'react';


import './App.css';
import TopBar from './topbar';
import Footer from './footer';
import SelDoor from './seldoor';
import Main from './main';
import Help from './help';
import Settings from './settings';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      doorselected: getCookie("doorselected"),
      door: getCookie("door"),
      curpage: "main"
    }
  }
  render() {
    return (
      <div className="App">
        <TopBar pagechange={this.pagechange.bind(this)} door={this.state.door} doorchange={this.doorchange.bind(this) }/>
        { (() => {
          if ( this.state.doorselected === "true" ) {
            switch (this.state.curpage ) {
              case "help":
                return <Help />
              case "settings":
                return <Settings />
              default:
                return <Main doorchange={this.doorchange.bind(this) } door={this.state.door}/>;
            }
          }
          else
            return <SelDoor chooseDoor={this.chooseDoor.bind(this)}/>;
        })() }
        <Footer />
      </div>
    );
  }
    chooseDoor(key) {
      setCookie("door", key, 100);
      setCookie("doorselected", "true", 100);
    this.setState( {
      doorselected: "true",
      door: key
    });
      console.log("cliked");
    }
  doorsel() {
    console.log("change");
    this.setState( {
      doorselected: "true"
    });
  }
  doorchange() {
    this.setState( {
      doorselected: "false"
    });
  }
  pagechange(page) {
    this.setState( {
      curpage: page
    });
  }
}

export default App;
