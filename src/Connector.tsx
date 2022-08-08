import React from "react";

class Connector extends React.Component<{}, {error: any, isLoaded: boolean, result: any}> {

  url:string;
  constructor(props) {
      super(props);
      this.state = {
          error: null,
          isLoaded: false,
          result: null
      };
      this.url = props.url;
  }


    componentDidMount() {
        fetch("http://localhost:8080/app/v2/defects/test") 
        .then(result => result.json())
        .then((result) => {
            this.setState({
                isLoaded: true,
                result:result.complaintNumber
            });
            return result;
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
        const { error, isLoaded, result } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          return (
            <p>{result}</p>
          );
        }
      }
};

export default Connector;
