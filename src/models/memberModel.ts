import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../config/db";

// Mendefinisikan atribut yang dimiliki oleh model member
interface MemberAttributes {
  name: string;
  email: string;
  phone: string;
}

//Buat kelas book yang mewarisi Model<MemberAttributes> lalu implementasikan MemberAttributes
class Member extends Model<MemberAttributes> implements MemberAttributes {
  public name!: string;
  public email!: string;
  public phone!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inisialisasi class Member yang menampung atribut MemberAttributes
Member.init(
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
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 12],
      },
    },
  },
  {
    sequelize: db,
    modelName: "member",
    freezeTableName: true,
  }
);

export default Member;
