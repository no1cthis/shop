import { gql } from "@apollo/client";

const FETCH_PRODUCTS_AND_COLOR = gql`
  query productsWithFilter($sortBy: String, $type: String) {
    productsWithFilter(sortBy: $sortBy, type: $type) {
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
    colors {
      name
      code
    }
  }
`;

const FETCH_PRODUCTS_WITH_FILTERS = gql`
  query productsWithFilter(
    $sortBy: String
    $type: String
    $minPrice: Float
    $maxPrice: Float
    $sort: Int
    $colors: [String]
    $sizes: [Int]
  ) {
    productsWithFilter(
      sortBy: $sortBy
      type: $type
      minPrice: $minPrice
      maxPrice: $maxPrice
      sort: $sort
      colors: $colors
      sizes: $sizes
    ) {
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

const FETCH_PRODUCT_TYPES = gql`
  query AllProductTypes {
    allProductTypes {
      name
    }
  }
`;

export {
  FETCH_PRODUCTS_AND_COLOR,
  FETCH_PRODUCTS_WITH_FILTERS,
  FETCH_PRODUCTS_BY_URL,
  FETCH_COLORS,
  FETCH_PRODUCT_TYPES,
};
