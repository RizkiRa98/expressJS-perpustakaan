import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../config/db";

// Mendefinisikan atribut yang dimiliki oleh model user
interface UserAttributes {
  name: string;
  email: string;
  password: string;
  role: "super admin" | "admin";
  refresh_token?: string | null;
}

// buat kelas untuk mewarisi model<UserAttributes> lalu implementasikan UserAttributes
class Users extends Model<UserAttributes> implements UserAttributes {
  public readonly id!: Number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "super admin" | "admin";
  public refresh_token?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inisialisasi model User dengan atribut yang sudah dibuat
Users.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM("super admin", "admin"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: db,
    modelName: "users",
    freezeTableName: true,
  }
);

export default Users;
