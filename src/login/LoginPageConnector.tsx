import React, { useState } from "react";
import LoginRequest from "./LoginRequest";
import LoginRequestConnector from "./LoginRequestConnector";
import { ReactDOM } from "react";
import axios from "axios";
import GridItemConnector from "./GridItemConnector.tsx";
import { Card } from "react-bootstrap";
import {Button} from "react-bootstrap";

import styles from './App.css';

class LoginPageConnector extends React.Component<{}, {error: any, isLoaded: boolean, result: any, loginSuccess?:boolean, loadAgain?: boolean, loginRequest?: LoginRequest}> {


  constructor(props) {
      super(props);
      this.state = {
          error: null,
          isLoaded: false,
          result: null,
          loadAgain: true
      };
    this.handleInput = this.handleInput.bind(this); 
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.print = this.print.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    
      axios.get("http://localhost:8080/app/v3/defects/test")
        .then((result) => {
            this.setState({
                isLoaded: true,
                result:result.data,
                loadAgain: false
            });
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error
            });
            }
        );
  }
    

    async loginRequest(loginRequest: LoginRequest) {

    
      const data:string = `username=${loginRequest.username}&password=${loginRequest.password}&captcha=${loginRequest.captcha}&id=${loginRequest.sessionId}&server=${loginRequest.serverId}&includeOther=off&showOnlyNumbers=off`

      this.setState({

      })
      await axios.post("http://localhost:8080/app/v3/defects/login", data)  
      .then((result) => {
            this.setState({
              isLoaded: true,
              result:result.data,
              loginSuccess: result.data.loginSuccess
          })
        },
      (error) => {
          this.setState({
              isLoaded: true,
              error
          });
          }
      );
  }

    handleOnSubmit(event) {
      event.preventDefault();
      var loginRequest:LoginRequest;
      if (!this.state.loginRequest) {
        loginRequest = {
          serverId: this.state.result.serverId,
          sessionId: this.state.result.sessionId
        };
      } else {
        loginRequest = this.state.loginRequest!
      }
      console.log(JSON.stringify(loginRequest));
      this.loginRequest(loginRequest);
    }
    
    handleInput(event) {
      event.preventDefault();
      const target = event.target;
      const localLoginRequest:LoginRequest = {};
      if (this.state.loginRequest) {
        localLoginRequest.username = this.state.loginRequest!.username;
        localLoginRequest.password = this.state.loginRequest!.password;
        localLoginRequest.captcha = this.state.loginRequest!.captcha;
      }
      this.setState({
        loginRequest: {
          username: localLoginRequest.username,
          password: localLoginRequest.password,
          captcha: localLoginRequest.captcha,
          sessionId: this.state.result.sessionId,
          serverId: this.state.result.serverId,
          [target.name]: target.value
        },
        result: this.state.result
      })

      
    }

    loginForm(result) {
      return (
        <html>
          <body>
            <Card style={{border: `1.4px solid black`, position: 'relative', marginTop:'15%', marginLeft:'40%', marginRight:'60%',
              right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', width:'310px',
               height:'225px',  fontSize:'13px'}}>
                <Card.Title  style={{position:'relative', marginTop:'0%', marginLeft:'35%', fontSize:'25px'}}>Login</Card.Title>
                <Card.Body>
                  <Card.Text>
                  <form style={{position:'relative', marginTop:'15%', marginLeft:'25%'}} onSubmit={this.handleOnSubmit}>
                    <input type="text" name="username" onChange={this.handleInput} placeholder="Enter username"></input><br></br><br></br>
                    <input type="password" name="password" onChange={this.handleInput} placeholder="Enter password"></input><br></br>
                    <img src={result.captchaImageUrl}></img><br></br>
                    <input type="text" name="captcha" onChange={this.handleInput} placeholder="Enter captcha"></input><br></br><br></br>
                    <button style={{marginLeft:'23%'}} type="submit" name="Login" value="login">Login</button>
                  </form>
                  </Card.Text>
                </Card.Body>
            </Card>
        </body>
        </html>
      );
    }

    print() {
      if (this.state.isLoaded) {
        window.print();
      } else {
        alert("Please wait");
      }
    }

    render() {
        const { error, isLoaded, loginSuccess, result } = this.state;
        if (error) {
          return <div><a>Something went wrong..! Possible reason : {error.message}</a></div>;
        } else if (!isLoaded) {
          return <div><img style={{position: 'relative', marginTop:'15%', marginLeft:'40%',height:"100px", width:"100px"}} src="https://raw.githubusercontent.com/absatish/defectslist-ui/main/public/loading.gif"/></div>;
        } else if (result.errorMessage) {
          return <div>{result.errorMessage}</div>
        } else if (loginSuccess) {
          let output = new Array();
          let j=0;
          for (let i=0;i<result.complaintIds.length;i++) {
            let column = j<3;
            let row = j==3;
            if (row) {
              j=0;
            }
            output.push(<GridItemConnector complaintId={result.complaintIds[i]} column={true} row={false}></GridItemConnector>)
            j++;
          }
          let finalOutput = new Array();
          let i=0;
          let jj=0;
          finalOutput.push(<tr><td colSpan={2}>Welcome {result.loggedInUser}({result.userId})</td>
          <td colSpan={1}><button onClick={this.print}>Print this whole page</button></td></tr>) 
          let intermediateOuput = new Array(3);
          output.forEach(o => {

            if (i!=2) {
              intermediateOuput.push (<><td>{o}</td><td><img style={{height:'260px'}} src={result.verticalImageUrl}></img></td></>)
            } else {
              intermediateOuput.push (<td style={{height:'250px'}}>{o}</td>)
            }
            if (i==2) {
              jj++;
              i=-1;
              finalOutput.push(<><tr>{intermediateOuput.map(io => io)}</tr>
              <tr><td colSpan={5}><hr style={{border:'1px dotted black'}}></hr></td></tr></>)
              intermediateOuput = [];
            }
            if (jj==4) {
              finalOutput.push(<tr className='pagebreak'><td colSpan={3}><hr></hr></td></tr>)
              jj=0
            }
            i++;
        }
        );   
        return <table>{
          finalOutput
          }</table>;
        } else {
          return this.loginForm(result);
        }
      }
};

export default LoginPageConnector;

