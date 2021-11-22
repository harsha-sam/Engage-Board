'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    // methods here
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  };
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('student', 'faculty'),
      allowNull: false
    },
    classrooms: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    createdAt: {
      field: 'created_at',
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updatedAt: {
      field: 'updated_at',
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    }
  }, {
    // hooks and other options
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(12);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};