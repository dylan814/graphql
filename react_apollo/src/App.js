import React, {Component} from 'react';
import MainRouter from './MainRouter'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import {BrowserRouter as Router} from 'react-router-dom'
// 


            
const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql'
});




class App extends Component {
  render() {
   
    return (

      <ApolloProvider client={client}>
        <Router >
            <MainRouter />
        </Router>
      </ApolloProvider>
  
    );
  }
}

export default App;
