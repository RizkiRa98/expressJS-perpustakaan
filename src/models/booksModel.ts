import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../config/db";
import Categories from "./categoryModel";
import Borrowing from "./borrowingModel";

// Mendefinisikan atribut yang dimiliki oleh model book
interface BookAttributes {
  name: string;
  author: string;
  publisher: string;
  categoryId: number;
  status: "available" | "unavailable";
  borrowingId?: number | null;
}

// Buat kelas Book yang mewarisi Model<BookAttributes> lalu implmenetasikan BookAttributes
class Books extends Model<BookAttributes> implements BookAttributes {
  public name!: string;
  public author!: string;
  public publisher!: string;
  public categoryId!: number;
  public status!: "available" | "unavailable";
  public borrowingId?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Books.init(
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
  {
    sequelize: db,
    modelName: "books",
    freezeTableName: true,
  }
);

// Menghubungkan tabel books dengan category
Categories.hasMany(Books, { foreignKey: "categoryId" });
Books.belongsTo(Categories, { foreignKey: "id" });

Borrowing.hasMany(Books, { foreignKey: "borrowingId" });
Books.belongsTo(Borrowing, { foreignKey: "id" });

export default Books;
