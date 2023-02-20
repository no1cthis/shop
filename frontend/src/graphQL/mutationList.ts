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

const DELETE_COLOR = gql`
  mutation DeleteColor($name: String!) {
    deleteColor(name: $name)
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

const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $title: String!
    $description: String!
    $type: String!
    $price: Float!
    $color: [ColorInput]!
    $allSizes: [Int]!
    $url: String!
  ) {
    editProduct(
      title: $title
      description: $description
      type: $type
      price: $price
      color: $color
      allSizes: $allSizes
      url: $url
    ) {
      ... on Product {
        url
        color {
          name
          photos
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

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($url: String!) {
    deleteProduct(url: $url)
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

const DELETE_PRODUCT_TYPE = gql`
  mutation DeleteProductType($name: String!) {
    deleteProductType(name: $name)
  }
`;

const EDIT_ORDER = gql`
  mutation EditOrder($order: OrderInput!) {
    editOrder(order: $order) {
      status
    }
  }
`;

const CANCEL_RESERV = gql`
  mutation CancelReserv($cancelReservId: String!) {
    cancelReserv(id: $cancelReservId)
  }
`;

const CANCEL_ALL_OLDER_THAN_RESERVS = gql`
  mutation Mutation($olderThan: Float!) {
    cancelAllOlderThanReserv(olderThan: $olderThan)
  }
`;

export {
  ADD_COLOR,
  DELETE_COLOR,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  DELETE_PRODUCT,
  ADD_PRODUCT_TYPE,
  DELETE_PRODUCT_TYPE,
  EDIT_ORDER,
  CANCEL_RESERV,
  CANCEL_ALL_OLDER_THAN_RESERVS,
};
