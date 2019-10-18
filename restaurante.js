const mongoose = require("mongoose");
const CONNECTION_URL =
  "mongodb+srv://jos:saprihora19@clusterreservaciones-niakt.mongodb.net/jos?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true }, err => {
  if (!err) console.log("conexion exitosa");
});

const Schema = mongoose.Schema;
const RestauranteSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  ubicacion: {
    type: Map,
    of: String
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    ref: "Menu",
    required: true
  },
  parqueo: {
    type: Boolean,
    default: true
  },
  consumo: {
    type: Number,
    default: 0
  },
  espacios: {
    type: Number,
    required: true
  }
});

const Restaurante = mongoose.model("Restaurante", RestauranteSchema);

const ClienteSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  telefono: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  reservaciones: [
    { type: mongoose.Schema.ObjectId, ref: "Reservacion", required: false }
  ]
});

const Cliente = mongoose.model("Cliente", ClienteSchema);

const ReservacionSchema = new Schema({
  restaurante: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurante",
    required: true
  },
  cliente: {
    type: mongoose.Schema.ObjectId,
    ref: "Cliente",
    required: true
  },
  fechaReservacion: {
    type: Date
  },
  estado: {
    type: Boolean,
    default: false
  },
  personas: {
    type: Number,
    required: true
  }
});

const Reservacion = mongoose.model("Reservacion", ReservacionSchema);

const MenuSchema = new Schema({
  entradas: [String],
  platosFuertes: [String],
  postres: [String]
});

const Menu = mongoose.model("Menu", MenuSchema);
module.exports = { Menu, Cliente, Reservacion, Restaurante };
