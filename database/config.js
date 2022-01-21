const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log("Db online");
  } catch (e) {
    console.log(e);
    throw new Error("Error al inicializar la BD");
  }
};

module.exports = {
  dbConnection,
};
