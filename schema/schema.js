const graphql = require('graphql');
const _ = require('lodash');
const {GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList} = graphql


const User = require("../models/user");
const Post = require("../models/posts")

const GraphQLDate = require('graphql-date')
const {GraphQLJSON, GraphQLJSONObject }  = require('graphql-type-json');
const jwt = require("jsonwebtoken");






    const UserType =  new GraphQLObjectType({

        
    
        name: 'User',
        fields: () => ({
    
            id: {type: GraphQLID},
            name: {type: GraphQLString},
            email: {type: GraphQLString},
            created: {type: GraphQLDate},
            hashed_password : {type: GraphQLString},
            salt: {type: GraphQLString},
            updated: {type: GraphQLDate},
            about: {type: GraphQLString},
            following:{type: new GraphQLList(GraphQLID)},
            followers:{type: new GraphQLList(GraphQLID)},
            resetPasswordLink: {type: GraphQLJSONObject},
            photo: {type:GraphQLJSONObject},
            message: {type: GraphQLString},
            posts: {

                type: new GraphQLList(PostType),
                resolve(parent, args) {
                   
                    return Post.find({postedBy:parent.id});



                }
            }
   
    
        })
    
    
    });



    const PostType =  new GraphQLObjectType({

        
    
        name: 'Post',
        fields: () => ({
    
            id: {type: GraphQLID},
            title: {type: GraphQLString},
            body: {type: GraphQLString},
            photo: {type: GraphQLString},
            postedBy: {type: GraphQLID},
            created: {type: GraphQLDate},
            updated: {type: GraphQLDate},
            likes: {type: new GraphQLList(GraphQLID)},
            
            
            
            
            })

            
    
        

    
    
    
    });
    

    const RootQuery = new GraphQLObjectType ({

        name: 'RootQueryType',
        fields: { 
     
    
            users:{
    
                type: new GraphQLList(UserType),
                // args: {id: { type: GraphQLID}},
                resolve(parent,args,{user}) {

                    
    
                    // return authors;
                    return User.find({});
                }
            },
    
            user:{

                type: UserType,
                args: {id: { type: GraphQLID}},
                resolve(parent,args) {
    
                    // return _.find(books, {id: args.id})
    
                    return User.findById(args.id)
                }
            },

            posts:{
    
                type: new GraphQLList(PostType),
                // args: {id: { type: GraphQLID}},
                resolve(parent,args,{user}) {

                    if (!user){

                        throw new Error (" You are not authorized to do this operation")


                    }
    
                    // return authors;
                    return Post.find({});
                }
            },
    
        }


    })



    const Mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addUser: {
                type: UserType,
                args: {
                    name: { type: GraphQLString },
                    email: { type: GraphQLString },
                    password: {type: GraphQLString},
                    message: {type: GraphQLString}
                },
                async resolve(parent, args, context){

                    // console.log(context.req);
                    const userExists = await User.findOne({ email: args.email});
                    if (userExists) {
                       
                        throw new Error( "error Email is taken!");

                    }

                    
                    const user = await new User({name:args.name, email: args.email, password: args.password});
                    // message: "Signup Success! Baby this worked"});
                 
                    
                    
                    // res.status(200).json({ message: "Signup success! Please login." });
                    return await user.save();
                      
                }
            },


        
            Signin: {
                type: UserType,
                args: {
                    
                    email: { type: GraphQLString },
                    password: {type: GraphQLString},
                
                },
                async resolve(parent, {email,password}, context){

                    // console.log(context.req);
                    const userExists = await User.findOne({ email } );
                    console.log(userExists);
                    
                    if (!userExists) {
                       
                        throw new Error( "No user with that email");

                    }


                 
                    if (!userExists.authenticate(password)) {
                        return context.res.status(401).json({
                            error: "Email and password do not match"
                        });
                    }

                    const token = jwt.sign({ _id: userExists._id }, process.env.JWT_SECRET);
                    
                    // persist the token as 't' in cookie with expiry date
                    context.res.cookie("t", token, { expire: new Date() + 9999 });
                    // retrun response with user and token to frontend client
                    const { _id, name} = userExists;
                    return context.res.json({ token, user: { _id, email, name } });


                    // res.status(200).json({ message: "Signup success! Please login." });
        
                      
                }
            },



            DeleteUser: {
                type: UserType,
                args: {
                    
                    id: { type: GraphQLID },
        
                
                },
                async resolve(parent, {id},{res,user} ){


                    if(!user) {

                        throw new Error("you are not authorized son")
                    }


                    const user1 = await User.findById(id);

                    const user2 = await user1.remove();

                    return user2;




                    


                 
                   
        
                      
                }
            },







    
    
    
            
        }
    });
    
    





    module.exports = new GraphQLSchema ({

        query: RootQuery,
        mutation: Mutation
    });