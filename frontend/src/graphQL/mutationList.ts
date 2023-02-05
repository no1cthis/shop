import { gql } from "@apollo/client";

const ADD_COLOR = gql`
  mutation AddNewColor($name: String!, $code: String!) {
    addNewColor(name: $name, code: $code) {
      ... on Error {
        message
      }
      ... on ColorChoose {
        name
        code
      }
    }
  }
`;
const ADD_PRODUCT = gql`
  mutation AddNewProduct(
    $title: String!
    $description: String!
    $type: String!
    $price: Float!
    $color: [ColorInput]!
    $allSizes: [Int]!
  ) {
    addNewProduct(
      title: $title
      description: $description
      type: $type
      price: $price
      color: $color
      allSizes: $allSizes
    ) {
      ... on Product {
        title
        url
        description
        type
        price
        allSizes
        buyCount
        color {
          name
          sizesAvailable {
            _36
            _37
            _38
            _39
            _40
            _41
            _42
            _43
            _44
            _45
            _46
            _47
          }
        }
      }
      ... on Error {
        message
      }
    }
  }
`;
const ADD_PRODUCT_TYPE = gql`
  mutation AddNewProductType($name: String!) {
    addNewProductType(name: $name) {
      ... on Error {
        message
      }
      ... on ProductType {
        name
      }
    }
  }
`;

export { ADD_COLOR, ADD_PRODUCT, ADD_PRODUCT_TYPE };
