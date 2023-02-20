import { gql } from "@apollo/client";

const FETCH_PRODUCTS_WITH_FILTERS = gql`
  query CardsWithFilter(
    $minPrice: Float
    $maxPrice: Float
    $sortBy: String
    $sort: Int
    $type: String
    $colors: [String]
    $sizes: [Int]
  ) {
    productsWithFilter(
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortBy: $sortBy
      sort: $sort
      type: $type
      colors: $colors
      sizes: $sizes
    ) {
      title
      url
      description
      type
      price
      allSizes
      buyCount
      demoPhotos
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
  }
`;

const FETCH_CARDS_WITH_FILTERS = gql`
  query ProductsWithFilter(
    $minPrice: Float
    $maxPrice: Float
    $sortBy: String
    $sort: Int
    $type: String
    $colors: [String]
    $sizes: [Int]
  ) {
    cardsWithFilter(
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortBy: $sortBy
      sort: $sort
      type: $type
      colors: $colors
      sizes: $sizes
    ) {
      title
      url
      price
      allSizes
      color {
        name
        photo
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

const FETCH_PRODUCTS_BY_TITLE = gql`
  query ProductsByTitle($title: String!) {
    productsByTitle(title: $title) {
      title
      url
      description
      type
      price
      allSizes
      buyCount
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
  }
`;

const FETCH_PRODUCTS_BY_URL = gql`
  query ProductByUrl($url: String!) {
    productByUrl(url: $url) {
      title
      description
      type
      price
      allSizes
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
  }
`;

const FETCH_COLORS = gql`
  query Colors($name: String) {
    colors(name: $name) {
      name
      code
    }
  }
`;

const FETCH_COLORS_BY_TYPE = gql`
  query ColorsByType($type: String!) {
    colorsByType(type: $type) {
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

const FETCH_ORDERS = gql`
  query Orders(
    $customerName: String
    $sortBy: String
    $sort: Int
    $recieverName: String
    $email: String
    $phone: String
  ) {
    orders(
      customerName: $customerName
      sortBy: $sortBy
      sort: $sort
      recieverName: $recieverName
      email: $email
      phone: $phone
    ) {
      id
      products {
        title
        color
        size
        quantity
      }
      customer {
        name
        email
        phone
      }
      reciever {
        address {
          city
          country
          line1
          line2
          postal_code
          state
        }
        name
      }
      created
      status
    }
  }
`;

const FETCH_RESERVED = gql`
  query Reservs {
    reservs {
      id
      created
      products {
        title
        color
        size
        quantity
      }
    }
  }
`;

export {
  FETCH_PRODUCTS_WITH_FILTERS,
  FETCH_CARDS_WITH_FILTERS,
  FETCH_PRODUCTS_BY_TITLE,
  FETCH_PRODUCTS_BY_URL,
  FETCH_COLORS,
  FETCH_COLORS_BY_TYPE,
  FETCH_PRODUCT_TYPES,
  FETCH_ORDERS,
  FETCH_RESERVED,
};
