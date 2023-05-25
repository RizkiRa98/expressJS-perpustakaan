import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../config/db";
import Member from "./memberModel";

// Mendefinisikan atribut yang dimiliki oleh model borrowing
interface BorrowingAttributes {
  memberId: number;
  booksId: number;
  borrow_at: Date;
  return_at?: Date | null;
  max_return: Date;
  charge?: string | null;
  status: "returned" | "not returned";
}

// Buat kelas Borrowing yang mewarisi Model<BorrowingAttributes> lalu implementasikan BorrowingAttributes
class Borrowing
  extends Model<BorrowingAttributes>
  implements BorrowingAttributes
{
  public memberId!: number;
  public booksId!: number;
  public borrow_at!: Date;
  public return_at?: Date | null;
  public max_return!: Date;
  public charge?: string | null;
  public status!: "returned" | "not returned";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Borrowing.init(
  {
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    booksId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    borrow_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    return_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    max_return: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    charge: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM("returned", "not returned"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  { sequelize: db, modelName: "borrowing", freezeTableName: true }
);

// // Menghubungkan tabel borrowing dengan member
Member.hasOne(Borrowing, { foreignKey: "memberId" });

Borrowing.belongsTo(Member, { foreignKey: "memberId" });

export default Borrowing;
