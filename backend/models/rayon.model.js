module.exports = (mongoose) => {
  const Rayon = mongoose.model(
    "rayon",
    mongoose.Schema(
      {
        title: String,
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
        isDefault: Boolean,
      },
      { timestamps: true }
    )
  );

  return Rayon;
};
