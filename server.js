const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
const app = express();

let message = "This is a message";
const schema = buildSchema(`
    
    type Post{
        userId:Int
        id:Int
        title:String
        body:String
    }
    
    type User {
        name:String
        age:Int
        college:String
    }
    type Query{
        hello: String!
        welcomeMessage(name:String,dayOfWeek:String!): String
        getUser:User
        getUsers:[User]
        getPostsFromExternalAPI:[Post]
        getMessage:String
    }
    input UserInput {
        name:String!
        age:Int!
        college:String!
    }

    type Mutation{
        setMessage(newMessage:String):String
        createUser(user:UserInput):User
    }
`)

// createUser(name:String!, age:Int!,college:String!):User [-->earlier code--]

const user = {
    name: 'Ritik Raj',
    age: 26,
    college: 'Chitkara University',
}
const root = {
    hello: () => {
        return "Hello World!"
    },
    welcomeMessage: (args) => {
        // console.log(args);
        return `Hey, ${args.name} How's life?. Today is ${args.dayOfWeek}`;
    },
    getUser: () => {
        return user;
    },
    getUsers: () => {
        const users =[{
            name: 'Ritik Raj',
            age: 22,
            college: 'Chitkara University',
        },{
            name: 'Abhinav Mahajan',
            age: 22,
            college: 'Chitkara University',
        }]
        return users;
    },
    getPostsFromExternalAPI: async () => {
        const result = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return result.data;
    },
    setMessage: ({ newMessage }) => {
        message = newMessage
        return message;
    },
    getMessage: () => message,
    createUser: (args) => {
        // create a new User inside db or external Api

        // return {name,age,college}
        return args.user;
    }
}

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue:root,
}))


app.listen(4000,()=>console.log(' ☸ Server on port 4000'))
