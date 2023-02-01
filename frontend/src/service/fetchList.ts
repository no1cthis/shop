import { gql } from "@apollo/client";

const FETCH_PRODUCTS_BY_POPULARITY_AND_COLOR = gql`
  query Query($type: String!) {
    productsByPopularity(type: $type) {
      _id
      title
      description
      type
      price
      url
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
    colors {
      name
      code
    }
  }
`;

const FETCH_PRODUCTS_BY_POPULARITY = gql`
  query Query($type: String!) {
    productsByPopularity(type: $type) {
      _id
      title
      description
      type
      price
      url
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
  }
`;

const FETCH_PRODUCTS_BY_PRICE = gql`
  query ProductsByPrice($type: String!, $sort: Int) {
    productsByPrice(type: $type, sort: $sort) {
      _id
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
  }
`;

const FETCH_PRODUCTS_BY_URL = gql`
  query ProductByUrl($url: String!) {
    productByUrl(url: $url) {
      _id
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
  }
`;

const FETCH_COLORS = gql`
  query Colors {
    colors {
      name
      code
    }
  }
`;

export {
  FETCH_PRODUCTS_BY_POPULARITY_AND_COLOR,
  FETCH_PRODUCTS_BY_POPULARITY,
  FETCH_PRODUCTS_BY_PRICE,
  FETCH_PRODUCTS_BY_URL,
  FETCH_COLORS,
};
