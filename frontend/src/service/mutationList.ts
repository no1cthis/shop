import { gql } from "@apollo/client";

const ADD_COLOR = gql`
  mutation Mutation($code: String!, $name: String!) {
    addNewColor(code: $code, name: $name) {
      name
      code
    }
  }
`;

export { ADD_COLOR };
