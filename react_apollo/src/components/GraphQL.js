import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { graphql} from 'react-apollo';
import flowRight from 'lodash.flowright';


const getUsers = gql`
{

  users {
    
    id
    name
    email
  }
}
`


const getPosts = gql`
{

  posts {
    
    id
    title
    body
    
  }
}
`



class GraphQL extends Component {

displayUsers() {

   const data = this.props.data;
   
//    const {loading, error} = this.props.data

   if (this.props.loading === true || this.props.loading === undefined) {

    return (<p>Loading users ... </p> )

   }


   else if (this.props.error) {

    return (<p> Error</p>)
   }

   else {


    return data.users.map(user => {


        return (
                <div>
                <li key={user.id}> {user.name}</li>
                 <p key={user.id}> {user.email}</p>
                 </div>)
    })
   }

}





   displayPosts() {

    const data = this.props.data;
    
    // const {loading, error} = this.props.data
 
    if (this.props.loading === true ) {

        return (<p>Loading users ... </p> )
    
       }
    
    
       else if (this.props.error) {
    
        return (<p> Error</p>)
       }
    
    else {
 
 
     return data.posts.map(post => {
 
 
         return (
                 <div>
                 <li key={post.id}> {post.title}</li>
                  <p key={post.id}> {post.body}</p>
                  </div>)
     })
    }
 
   
   



}


render() {

console.log(this.props);

return (
<div>
{this.displayUsers()}
{this.displayPosts()}
</div>

)

}
}


export default flowRight(
    
    graphql(getUsers, {name: "getUsers"}),
    graphql(getPosts, {name: "getPosts"})
)(GraphQL);