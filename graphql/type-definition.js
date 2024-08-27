export const typeDefinition = `
  type Query {
    flights(page: Int!, size: Int!, code: String): FlightResponse!
    available(code: String!): AvailableResponse!
    status(ids: [ID!]!): FlightStatusResponse!
    find(id: ID!): Flight!
    me: UserResponse!
  }
  
  type Mutation {
    create(flight: FlightData!): Flight!
    update(id: ID!, flight: FlightData!): Flight!
    delete(id: ID!): String!
    register(name: String!, email: String!, password: String!): AuthenticatedResponse!
    login(email: String!, password: String!): AuthenticatedResponse!
    refresh(refreshToken: String!): RefreshTokenResponse!
  }
  
  type FlightResponse {
    total: Int!
    count: Int!
    resources: [Flight!]!
  }
  
  type AvailableResponse {
    status: String!
  }
  
  type FlightStatusResponse {
    resources: [FlightStatusResource!]!
  }
  
  type FlightStatusResource {
    id: ID!
    status: String!
    img: String!
  }
  
  input FlightData {
    code: String!
    capacity: Int!
    departureDate: String!
  }

  type Flight {
    id: ID!
    code: String!
    capacity: Int!
    departureDate: String!
    status: String!
    img: String!
  }
  
  type UserResponse {
    id: ID!
    name: String!
    email: String! 
  }
  
  type AuthenticatedResponse {
    id: ID!
    name: String!
    email: String! 
    token: String!
    refreshToken: String! 
  }
  
  type RefreshTokenResponse {
    token: String!
    refreshToken: String! 
  }
`;
