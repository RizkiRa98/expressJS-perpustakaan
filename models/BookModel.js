import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Categories from "./CategoryModel.js";
import Borrowing from "./BorrowingModel.js";

const { DataTypes } = Sequelize;

const Books = db.define(
  "books",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM("available", "unavailable"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    borrowingId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Mengizinkan foreign key menjadi null
      defaultValue: null, // Nilai default jika tidak ada foreign key
      validate: {
        // Validasi tambahan jika diperlukan
      },
    },
  },
  { freezeTableName: true }
);

// Menghubungkan tabel books dengan category
Categories.hasMany(Books, { foreignKey: "categoryId" });
Books.belongsTo(Categories, { foreignKey: "id" });

Borrowing.hasMany(Books, { foreignKey: "borrowingId" });
Books.belongsTo(Borrowing, { foreignKey: "id" });

export default Books;
