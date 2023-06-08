/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable brace-style */
import {Model, DataTypes} from 'sequelize';
import db from '../config/db';

// Mendefinisikan atribut yang dimiliki oleh model category
interface CategoriesAttributes {
  name: string;
}

// Buat kelas category yang mewarisi Model<CategoriesAttributes>
// lalu implementasikan CategoriesAttributes
class Categories
  extends Model<CategoriesAttributes>
  implements CategoriesAttributes
{
  public readonly id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public static associations: {
  //   category: Association<Books, Categories>;
  // };
  // static associate: (models: any) => void;
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
  {sequelize: db, modelName: 'categories', freezeTableName: true},
);

export default Categories;

