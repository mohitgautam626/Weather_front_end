import React,{Component} from 'react';
import logo from './components/images/logo.png'
import './App.css';
import Home from './components/Home'

class Control extends Component {
  constructor(){
    super()
    this.state={
    }
  }
  render(){
    return(
      <div className="App">
      <div className="d1">
    <div className="head">
    <div>
    <img src={logo} height={'80'} width={'80'} alt="logo"/>
  </div>
  <div>
    <h1 className="h_we"><b>WeatherForU</b></h1>
  </div>
  </div>
  </div>
  <Home/>
  <div className="container-fluid d2">
<div className="row">
<div className="col-xs-12 foot">
<h3 className="t"><b>DEVELOPED BY MOHIT</b></h3>
</div>
</div>
</div>
  </div>
    );
  }
}

export default Control;
