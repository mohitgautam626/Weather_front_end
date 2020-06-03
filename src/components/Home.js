import React,{Component} from 'react';
import axios from 'axios';
import Wlo from './images/wlo.webp';
import Chart from 'react-google-charts';

class Home extends Component{
  constructor(){
    super()
    this.state={
      city:"",
      list:[],
      key:0,
      detail:"",
      forcst:[],
      hour:[],
      ctemp:[],
    }
  }
  clickHandler(event){
    this.setState({
      [event.target.name]:event.target.value,
    })
  }
  submitHandler(event){
    event.preventDefault();
    axios.post('https://weather-back-end.herokuapp.com/details',this.state)
    .then(response=>{
      this.setState({
        list:response.data,
      })
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
    })
  }
  detailhandler(x){
    //event.preventDefault();
    console.log(x);
    const stud={
      key:x.Key,
    }
    console.log(stud);
    axios.post('https://weather-back-end.herokuapp.com/data',stud)
    .then(response=>{
      this.setState({
        detail:response.data.Headline,
        forcst:response.data.DailyForecasts,
      })
      console.log(this.state.detail.Text);
      console.log(this.state.forcst);
    })
    .catch(error=>{
      console.log(error);
    })
    axios.get(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${x.Key}?apikey=MtFArvjR2ZCwarVZ1Vg83FpkwuBraiyQ`)
    .then(response=>{
      this.setState({
        hour:response.data,
      })
      console.log(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
    axios.get(`https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${x.Key}?apikey=MtFArvjR2ZCwarVZ1Vg83FpkwuBraiyQ`)
    .then(response=>{
      this.setState({
        ctemp:response.data,
      })
      console.log(response.data);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  render(){
    const {list,city,detail,forcst,hour,ctemp}=this.state;
    const g1=[[{type:"string",label:"Time(s)"},{type:"number",label:"Temperature"}]];
    var row=hour.map(val=>val.DateTime);
    var col=hour.map(val=>val.Temperature.Value);
    var time;
    for(var i=0;i<hour.length;i++){
      var xx=[];
      row[i].split('').map(ch=>xx.push(ch));
      var xy=xx[11]+""+xx[12];
      xy=parseInt(xy,10);
      if(i===0){
      time=xy;
      console.log(`time:${time}`);
    }
      var yy=((col[i]-32)*5)/9;
      yy=yy.toFixed(1);
      if(xy>=12){
        xy-=12;
        xy=xy+"pm";
      }
      else{
        xy+="am";
      }
      g1.push([xy,yy]);
    }
    return(
      <div className="container-fluid space">
      <div className="row">
      <div className="col-xs-1">
      </div>
      <div className="col-xs-3 search sidebod">
      <h1 className="heading">Search Weather</h1>
      <form onSubmit={this.submitHandler.bind(this)}>
      <div className="form-group">
      <input className="form-control search_input" placeholder="Search Place" type="text" onChange={this.clickHandler.bind(this)} name="city"/>
      </div>
      <div className="form-group">
      <button className="btn btn-info form-control" type="submit">Click</button>
      </div>
      </form>
      <div className="row">
      <div className="col-xs-11 over">
      {
        list.map(x=>{
        return(
          <div key={x.Key} onClick={this.detailhandler.bind(this,x)} className="searchdiv">
          <b>{x.LocalizedName}({x.Key})</b><br/>
          {x.AdministrativeArea.EnglishName},{x.Country. EnglishName}<br/>
          Lat:{x.GeoPosition.Latitude},Lon:{x.GeoPosition.Longitude}
          </div>
        );
        })
      }
      </div>
      </div>
      </div>
      <div className="col-xs-7 search">
      {
         forcst.map((item,index)=>{
           if(index===0){
             var min=item.Temperature.Minimum.Value;
             var max=item.Temperature.Maximum.Value;
             var x=((max-32)*5)/9;
             x=x.toFixed(1);
             var y=((min-32)*5)/9;
             y=y.toFixed(1);
             var temp=0;
             var tep="";
             if(time>18 && time<24){
               temp=item.Night.Icon;
               tep=item.Night.IconPhrase;
             }
             else{
               temp=item.Day.Icon;
               tep=item.Day.IconPhrase;
             }
          return(
      <React.Fragment key={index}>
      <h3 className="h3a">{tep}</h3>
      <font className="h3a">{detail.Text}</font>
      <div className="row">
      <div className="col-xs-1">
      <img src={require(`./Weather_Icons/${temp}.png`)} alt="today's" height={'120'} width={'150'}/>
      </div>
      <div className="col-xs-7">
      <h1 className="current temp">{
        ctemp.map(val=>{
          var v=((val.Temperature.Value-32)*5)/9;
          v=v.toFixed(1);
          return(
            <>
            {v}
            </>
          );
        })
      }<font className="current2">°C</font></h1>
      </div>
      <div className="col-xs-4">
      <p className="max_min">
      Maximum:{x}°C<br/>
      Minimum:{y}°C
      </p>
      </div>
      </div>
      </React.Fragment>
    );
  }
    })
    }
      <div className="row">
      <div className="col-xs-1"></div>
      <div className="col-xs-11">
      <Chart
      height={200}
      width={700}
      chartType="Line"
      loader={<div><h1 className="max_min">Just Search and Click to Get details</h1></div>}
      data={g1}
      options={{
        chart: {
          title:
            '',
        },
        colors:'black',
        backgroundColor:'black',
        width: 700,
        height: 200,
        series: {
          // Gives each series an axis name that matches the Y-axis below.
          0: { axis: 'Temp(C)' },
        },
        axes: {
          // Adds labels to each axis; they don't have to match the axis names.
          y: {
            Temps: { label: 'per Hour' },
          },
        },
      }}
      rootProps={{ 'data-testid': '1' }}
      />
      </div>
      </div>
      <div className="row">
      {
        forcst.map((item,index)=>{
          if(index!==0){
            var min=item.Temperature.Minimum.Value;
            var max=item.Temperature.Maximum.Value;
            var x=((max-32)*5)/9;
            var y=((min-32)*5)/9;
            x=x.toFixed(1);
            y=y.toFixed(1);
            var dt=new Date(item.Date);
            dt=dt.getDay();
            var day="";
            if(dt===0)
            day="Sunday";
            else if(dt===1)
            day="Monday";
            else if(dt===2)
            day="Tuesday";
            else if(dt===3)
            day="Wednesday";
            else if(dt===4)
            day="Thursday";
            else if(dt===5)
            day="Friday";
            else
            day="Saturday";
          return(
      <div className="col-xs-3 abc">
      {day}<br/>
      <img src={require(`./Weather_Icons/${item.Day.Icon}.png`)} height={'50'} width={'70'} alt="next"/><br/>
      <b className="ab1">{x}°c</b><br/>
      {y}°c<br/>
      {item.Day.IconPhrase}
      </div>
    );
  }
    })
      }
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default Home;
