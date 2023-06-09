/* eslint-disable @typescript-eslint/no-explicit-any */
import {Model, DataTypes} from 'sequelize';
import db from '../config/db';
import Borrowing from './borrowingModel';
import Categories from './categoryModel';

// Mendefinisikan atribut yang dimiliki oleh model book
interface BookAttributes {
  name: string;
  author: string;
  publisher: string;
  categoryId: number;
  status: 'available' | 'unavailable';
  borrowingId?: number | null;
}

// Buat kelas Book yang mewarisi Model<BookAttributes>
// lalu implmenetasikan BookAttributes
class Books extends Model<BookAttributes> implements BookAttributes {
  public readonly id!: number;
  public name!: string;
  public author!: string;
  public publisher!: string;
  public categoryId!: number;
  public status!: 'available' | 'unavailable';
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
      // eslint-disable-next-line new-cap
      type: DataTypes.ENUM('available', 'unavailable'),
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
    modelName: 'books',
    freezeTableName: true,
  },
);
Categories.hasMany(Books, {foreignKey: 'categoryId'});
Borrowing.hasMany(Books, {foreignKey: 'borrowingId'});
Books.belongsTo(Categories, {foreignKey: 'categoryId'});

Books.belongsTo(Borrowing, {foreignKey: 'borrowingId'});

// Categories.hasMany(Books, {
//   sourceKey: 'id',
//   as: 'Books',
//   foreignKey: 'categoryId',
// });
// Books.belongsTo(Categories, {foreignKey: 'id', as: 'Categories'});

// Borrowing.hasMany(Books, {as: 'Books', foreignKey: 'borrowingId'});
// Books.belongsTo(Borrowing, {as: 'Borrowing', foreignKey: 'id'});

export default Books;

