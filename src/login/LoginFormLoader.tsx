import React, { Component, useState } from "react";
import { ReactDOM } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import LoginRequest from "./LoginRequest";
import LoginRequestConnector from "./LoginRequestConnector";

class LoginFormLoader extends React.Component<{}, {error: any, isLoaded: boolean, result:any, serverId:any, sessionId:any, captcha:any, loginRequest?:LoginRequest}> {


  constructor(props) {
      super(props);
      this.state = {
          error: null,
          isLoaded: false,
          result: undefined,
          serverId: props.serverId,
          sessionId: props.sessionId,
          captcha: props.captcha
      };
    //   this.componentDidMount = this.componentDidMount.bind(this);
    //   this.reload = this.reload.bind(this);
      this.render = this.render.bind(this);
  }

//   async reload() {
//     this.setState({
//       isLoaded: false
//     })
//     await axios.get("http://localhost:8080/app/v3/defects/test/grid-item/" + this.state.complaintId)  
//         .then((result) => {
//             this.setState({
//                 isLoaded: true,
//                 result:result.data
//               });
//         },
//         (error) => {
//             this.setState({
//                 isLoaded: true,
//                 error
//             });
//             }
//         );
//   }

//   async componentDidMount() {
//         await axios.get("http://localhost:8080/app/v3/defects/test/grid-item/" + this.state.complaintId)  
//         .then((result) => {
//             this.setState({ 
//                 isLoaded: true,

//                 result:result.data
//             });
//         },
//         (error) => {
//             this.setState({
//                 isLoaded: true,
//                 error
//             });
//             }
//         );
//     }

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
        // return <LoginRequestConnector></LoginRequestConnector>
      }

    render() {
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
                        <img src={this.state.captcha}></img><br></br>
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
};

export default LoginFormLoader;

