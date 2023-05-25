import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../config/db";

// Mendefinisikan atribut yang dimiliki oleh model category
interface CategoriesAttributes {
  name: string;
}

// Buat kelas category yang mewarisi Model<CategoriesAttributes> lalu implementasikan CategoriesAttributes
class Categories
  extends Model<CategoriesAttributes>
  implements CategoriesAttributes
{
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Categories.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
  },
  { sequelize: db, modelName: "Categories", freezeTableName: true }
);

export default Categories;
