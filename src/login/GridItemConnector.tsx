import React, { Component, useState } from "react";
import { ReactDOM } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap";
import Table from "react-bootstrap/Table";
import GridItemLoader from "./GridItemLoader.tsx";
import styles from './App.css';

class GridItemConnector extends React.Component<{}, {error: any, reload:boolean, isLoaded: boolean, result:any, complaintId: string, column: boolean, row: boolean}> {


  constructor(props) {
      super(props);
      this.state = {
          error: null,
          reload: false,
          isLoaded: false,
          result: null,
          complaintId: props.complaintId,
          column: props.column,
          row: props.row
      };
      this.componentDidMount = this.componentDidMount.bind(this);
      this.reload = this.reload.bind(this);
  }

  async reload() {
    this.setState({
      complaintId: this.state.complaintId,
      isLoaded: false,
    })
    await axios.get("http://localhost:8080/app/v3/defects/test/grid-item/" + this.state.complaintId)  
        .then((result) => {
            this.setState({
                isLoaded: true,
                reload: false,
                result:result.data
              });
        },
        (error) => {
            this.setState({
                isLoaded: true,
                reload: true,
                error
            });
            }
        );
  }

  async componentDidMount() {
        await axios.get("http://localhost:8080/app/v3/defects/test/grid-item/" + this.state.complaintId)  
        .then((result) => {
            this.setState({ 
                isLoaded: true,
                result:result.data
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

    render() {
        const roundedCornerTable= {
          width:'300px',
          height:'250px',
          border:'1px solid black',
          borderRadius:'2px',
          borderSpacing:'0',
          fontSize:'12px'
          
        }
        const tr={
          width:'300px'
        }
        const roundedCornerMainTd= {
          borderBottom: '1px solid black',

          width:'300px'
        }
        const roundedCornerHeadingTd= {
          borderBottom: '1px solid black',
          width:'100px'
        }
        const roundedCornerContentTd= {
          borderBottom: '1px solid black',
          width:'200px'
        }
        const { reload, error, isLoaded, complaintId, result } = this.state;
        if (reload) {
          return <div>Reload</div>
        }
        if (!isLoaded) {
          return <div style={{alignItems:"center"}}><img style={{marginTop:"50px", marginLeft:"100px", height:"100px", width:"100px"}} src="../loading.gif"/></div>;
        } else if (error) {
          return <div style={{"color":"red"}}>Something went wrong <br></br><button onClick={this.reload}>Reload the page</button>
          </div>
        } else {
          return (
            <table style={roundedCornerTable}>
               <thead>
                <tr style={tr}>
                  <th style={roundedCornerMainTd} colSpan={2}> INWARRANTY DEFECTIVE ITEMS </th>
                </tr>
              </thead>
              <tbody>
              <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    Branch Name
                  </td>
                  <td style={roundedCornerContentTd}>
                    {result.branchName}
                  </td>
                </tr>
                <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    Complaint No
                  </td>
                  <td style={roundedCornerContentTd}>
                    {result.complaintNumber}
                  </td>
                </tr>
                <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    Date
                  </td>
                  <td style={roundedCornerContentTd}>
                    {result.date}
                  </td>
                </tr>
                <tr style={tr}>
                  <td style={roundedCornerHeadingTd}>
                    Product
                  </td>
                  <td style={roundedCornerContentTd}>
                  {result.product}
                  </td>
              </tr>
              <tr>
                <td style={roundedCornerHeadingTd}>
                  ModelName
                </td>
                <td style={roundedCornerContentTd}>
                  {result.model}
                </td>
              </tr>
              <tr>
                <td style={roundedCornerHeadingTd}>
                  Serial Number
                </td>
                <td style={roundedCornerContentTd}>
                  {result.serialNumber}
                </td>
              </tr>
              <tr>
                <td style={roundedCornerHeadingTd}>
                  DOP
                </td>
                <td style={roundedCornerContentTd}>
                  {result.dop}
                </td>
              </tr>
              <tr>
                <td style={roundedCornerHeadingTd}>
                  Spare Name
                </td>
                <td style={roundedCornerContentTd}>
                  {result.spareName}
                </td>
              </tr>
              <tr>
                <td style={roundedCornerHeadingTd}>
                  Actual Fault
                </td>
                <td style={roundedCornerContentTd}>
                  {result.actualFault}
                </td>
              </tr>
              <tr>
                <td style={roundedCornerHeadingTd}>
                  Tech Name
                </td>
                <td style={roundedCornerContentTd}>
                  {result.techName}
                </td>
              </tr>
              </tbody>
            </table>)
        }       
      }
};

export default GridItemConnector;

