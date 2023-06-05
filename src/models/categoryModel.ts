/* eslint-disable brace-style */
import {Model, DataTypes} from 'sequelize';
import db from '../config/db';
import Books from './booksModel';

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

// Categories.hasMany(Books, {
//   sourceKey: 'id',
//   as: 'Books',
//   foreignKey: 'categoryId',
// });
// Books.belongsTo(Categories, {foreignKey: 'id', as: 'Categories'});
export default Categories;

