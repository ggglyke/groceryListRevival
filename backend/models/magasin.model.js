module.exports = (mongoose) => {
  const Magasin = mongoose.model(
    "magasin",
    mongoose.Schema(
      {
        title: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rayonsOrder: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "rayon",
          },
        ],
        default: Boolean,
      },
      { timestamps: true }
    )
  );

  return Magasin;
};
