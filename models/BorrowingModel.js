import { Sequelize } from "sequelize";
import db from "../config/db.js";

import Member from "./MemberModel.js";

const { DataTypes } = Sequelize;

const Borrowing = db.define(
  "borrowing",
  {
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    borrowId: {
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
      allowNull: false,
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
      allowNull: false,
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
  { freezeTableName: true }
);

// // Menghubungkan tabel borrowing dengan member
Member.hasOne(Borrowing, { foreignKey: "memberId" });

export default Borrowing;
