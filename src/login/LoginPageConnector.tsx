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
    
      axios.get("https://winter-citizen-328416.el.r.appspot.com/app/v3/defects")
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
    

    loginRequest(loginRequest: LoginRequest) {

    
      const data:string = `username=${loginRequest.username}&password=${loginRequest.password}&captcha=${loginRequest.captcha}&id=${loginRequest.sessionId}&server=${loginRequest.serverId}&includeOther=${loginRequest.includeOthers}&showOnlyNumbers=off`

      this.setState({
        isLoaded: false
      })
      axios.post("https://winter-citizen-328416.el.r.appspot.com/app/v3/defects/login", data)  
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
      if (loginRequest && loginRequest.username && loginRequest.password && loginRequest.sessionId && loginRequest.serverId && loginRequest.captcha) {
        this.loginRequest(loginRequest);
      } else {
        return this.loginForm({errorMessage:'invalid fields'})
      }
      
    }
    
    handleInput(event) {
      event.preventDefault();
      const target = event.target;
      const localLoginRequest:LoginRequest = {};
      if (this.state.loginRequest) {
        localLoginRequest.username = this.state.loginRequest!.username;
        localLoginRequest.password = this.state.loginRequest!.password;
        localLoginRequest.captcha = this.state.loginRequest!.captcha;
        localLoginRequest.includeOthers = this.state.loginRequest!.includeOthers;
      }
      this.setState({
        loginRequest: {
          username: localLoginRequest.username,
          password: localLoginRequest.password,
          captcha: localLoginRequest.captcha,
          sessionId: this.state.result.sessionId,
          serverId: this.state.result.serverId,
          includeOthers: this.state.result.includeOther,
          [target.name]: target.value
        },
        result: this.state.result
      })

      
    }

    loginForm(result) {

      const width:string = '350px';
      const widthH:string = '120px';
      const widthC:string = '230px';

      const roundedCornerTable= {
        width: width,
        height:'200px',
        border:'1px solid black',
        borderRadius:'2px',
        borderSpacing:'0',
        fontSize:'15px',
        marginTop: '10%',
        marginLeft: '35%'
        
      }
      const tr={
        width
      }
      const roundedCornerMainTd= {
        borderBottom: '1px solid black',
        width
      }
      const roundedCornerHeadingTd= {
        borderBottom: '0px solid black',
        width:widthH
      }
      const roundedCornerContentTd= {
        borderBottom: '0px solid black',
        width:widthC
      }
      const inputBox={
        width: '97%',
        height: '97%'
      }

      return (
        <html>
          <body>
            <form style={roundedCornerTable} onSubmit={this.handleOnSubmit}>
                    
            <table>
               <thead>
                <tr style={tr}>
                  <th style={roundedCornerMainTd} colSpan={2}> Login Page </th>
                </tr>
              </thead>
              <tbody>
              <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    Username
                  </td>
                  <td style={roundedCornerContentTd}>
                  <input style={inputBox} type="text" name="username" onChange={this.handleInput} placeholder="Enter username"></input>
                  </td>
                </tr>
                <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    Password
                  </td>
                  <td style={roundedCornerContentTd}>
                    <input style={inputBox} type="password" name="password" onChange={this.handleInput} placeholder="Enter password"></input>
                  </td>
                </tr>
                <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    <img src={result.captchaImageUrl}></img>
                  </td>
                  <td style={roundedCornerContentTd}>
                    <input style={inputBox} type="text" name="captcha" onChange={this.handleInput} placeholder="Enter captcha"></input>
                  </td>
                </tr>
                <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    <input style={inputBox} type="checkbox" name="includeOthers" onChangeCapture={this.handleInput}></input>
                  </td>
                  <td style={roundedCornerContentTd}>
                    Show Other Complaints                    
                  </td>
                </tr>
                <tr style={tr}>
                  <td colSpan={2} style={roundedCornerContentTd}>
                    <button style={{marginLeft:'30%',width:'50%'}} type="submit" name="Login" value="login">Login</button>
                  </td>
                </tr>
                <tr style={tr}>
                  <td colSpan={2} style={roundedCornerContentTd}>
                      <div style={{fontSize:'13px',color:'red'}}>{result.errorMessage}</div>  
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
                  {/* </Card.Text>
                </Card.Body>
            </Card> */}
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
        if (!isLoaded) {
          return <div><img style={{position: 'relative', marginTop:'15%', marginLeft:'40%',height:"100px", width:"100px"}} src="https://raw.githubusercontent.com/absatish/defectslist-ui/main/public/loading.gif"/></div>;
        } else if (error || result.errorMessage) {
          if (error) {
            return this.loginForm({errorMessage:error.message});
          }
          return this.loginForm(result);
        } else if (loginSuccess) {
          let output = new Array();
          let j=0;
          for (let i=0;i<result.complaintIds.length;i++) {
            let column = j<3;
            let row = j==3;
            if (row) {
              j=0;
            }
            output.push(<GridItemConnector loggedInUser={result.loggedInUser} complaintId={result.complaintIds[i]} column={true} row={false}></GridItemConnector>)
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

