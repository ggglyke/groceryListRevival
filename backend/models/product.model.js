module.exports = (mongoose) => {
  const Product = mongoose.model(
    "produit",
    mongoose.Schema(
      {
        title: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        times_added: {
          type: Number,
          default: 0,
        },
        rayon: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "rayon",
        },
      },
      { timestamps: true }
    )
  );

  return Product;
};
