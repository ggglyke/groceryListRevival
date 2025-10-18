module.exports = (mongoose) => {
  const List = mongoose.model(
    "list",
    mongoose.Schema(
      {
        title: String,
        hasAisles: Boolean,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "produit",
          },
        ],
        checkedProducts: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "produit",
          },
        ],
        customProducts: [
          {
            title: String,
            rayon: { type: mongoose.Schema.Types.ObjectId, ref: "rayon" },
          },
        ],
        magasin: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "magasin",
          default: null,
        },
        published: Boolean,
      },
      { timestamps: true }
    )
  );

  return List;
};
