module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define("Reservation", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    seat_number: { type: DataTypes.INTEGER, allowNull: false },
  });
  return Reservation;
};
