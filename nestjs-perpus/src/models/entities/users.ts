import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100],
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  password: string;

  @Column({
    type: DataType.ENUM('super admin', 'admin'),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  role: 'super admin' | 'admin';

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  refresh_token: string;
}
