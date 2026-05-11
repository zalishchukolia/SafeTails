const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], default: "male" },
    age: { type: Number },
    weight: { type: Number },
    description: { type: String },
    status: {
      type: String,
      enum: [
        "Потребує порятунку",
        "В процесі порятунку",
        "На відновленні",
        "Врятовано",
        "В архіві",
      ],
      default: "Потребує порятунку",
    },
    imageUrl: { type: String },
    gallery: [{ type: String }],
    temperament: {
      type: String,
      enum: ["спокійний", "активний", "грайливий", "лагідний", "незалежний"],
      default: "спокійний",
    },
    city: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Animal", animalSchema);
