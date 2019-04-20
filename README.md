# GraphQL with React

## REST-ful Routing 
Given a record of collection of records on a server, there should be a uniform of URL and HTTP request method used to utilize that collection of records.

REST-ful routing tends to be too complicated if each records are highly related (too many HTTP requests or over-fetching data, etc).

## Graph Data Structure
A graph is a type of structure that contains nodes which are symbolized by the  different rectangles in here and relations between each of these nodes which referred to  as edges.

## GraphQL
Make queries to data which is stored in a form of a graph data structure.
```
query {
}
```

## Express Server
A HTTP server. It receives HTTP requests, processes the requests, formulate the response and send it back to whoever made the initial requests.

## Express with QraphQL
1. Express receives requests 
2. Express checks if the request needs to be sent to GraphQL

## GraphQL Schema
```
const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql

// What an User object looks like
// name: Type's name
// fields: properties that an User will have
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
})
```

### Root Query
A root query is something that allows us to jump into our Graph data. It works like an entry point to our app or data.

`args` is what should be passed when you make a request.

```
// If you want a User, give me the id, then I will give a User
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/users/${args.id}`)
      
        return response.data
      }
    }
  }
})
```

How to make a request.
```
user(id: "1") {
  name
}
``` 

### Relationships Between Schemas
UserType has a property called company. The company property has CompanyType and it is resolved by the company's id.
```
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)

        return response.data
      }
    }
  }
})
```

### Avoid type reference error
In JavaScript, every time we try to use a variable before it is defined, there will be an error. In order to avoid this when we define GraphQL Schema, we need to use an arrow function. **Using arrow function means that the callback is called after the entire file has been executed**.

```
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: new GraphQLList(UserType),
      async resolve(parentValue, args) {
        const response = await axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)

        return response.data
      }
    }
  })
})
``` 

## Query Fragments
A query fragment is essentially just a list of different properties that we want to get access to.
```
{
  apple: company(id: "1") {
    ...companyDetails
  },
  google: company(id: "2") {
    ...companyDetails
  }
}

fragment companyDetails on Company {
  id,
  name,
  description
}
```

## Mutations
Mutations are used to change our data in some fashion.

### Defining mutations
```
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      async resolve(parentValue, { firstName, age }) {
        const response = await axios.post('http://localhost:3000/users/', { firstName, age })

        return response.data
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
```

### Using the mutations
```
mutation {
  addUser(firstName: "Stephen", age: 26) {
    id
    firstName
    age
  }
}
```

