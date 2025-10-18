export default function productReducer(products, action) {
  switch (action.type) {
    case "added": {
      return [
        ...products,
        {
          product: action.product,
          checked: false,
        },
      ];
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
