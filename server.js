const express = require("express");
const bodyParser = require("body-parser");
const { Restaurante, Cliente, Reservacion, Menu } = require("./restaurante");
const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//registrar cliente
app.post("/cliente/registrar", (req, res) => {
  const jsonCliente = req.body;
  const nuevoCliente = Cliente(jsonCliente);
  nuevoCliente.save((err, cliente) => {
    err ? res.status(409).send(err) : res.status(201).send(cliente);
  });
});

//modificar cliente
app.put("/cliente/modificar", (req, res) => {
  const { id } = req.params;
  Cliente.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .exec()
    .then(cliente => {
      res.send(cliente);
    })
    .catch(err => {
      res.status(409).send(err);
    });
});

app.post("/reservaciones/agregar", (req, res) => {
  const JsonReservacion = req.body;
  const nuevaReservacion = Reservacion(JsonReservacion);
  nuevaReservacion.save((err, reservacion) => {
    Cliente.findById(nuevaReservacion.cliente).then(function(cliente) {
      var reservaciones = cliente.reservaciones;
      reservaciones.push(nuevaReservacion.id);
      Cliente.findByIdAndUpdate(cliente.id, {
        $set: { reservaciones: reservaciones }
      })
        .exec()
        .then(cliente2 => {
          console.log("Reservacion agregada al cliente");
        });
    });
    // // if (!err) {
    //   Cliente.findByIdAndUpdate(
    //     nuevaReservacion.cliente,
    //     { $set: req.body },
    //     { new: true }
    //   );
    //}
    err ? res.status(409).send(err) : res.status(201).send(reservacion);
  });
});

// //get pelicula por id
app.get("/cliente/reservacion/", (req, res) => {
  const { id } = req.params; //BORRAR
  Cliente.findById(id)
    .populate("reservaciones")
    .exec()

    .then(cliente => {
      res.send(cliente.reservaciones);
    })
    .catch(err => {
      res.status(409).send(err);
    });
});

app.delete("/reservacion/:id", (req, res) => {
  const { id } = req.params;
  Reservacion.findByIdAndDelete(id)
    .exec()
    .then(reserva => {
      res.status(204).send("Reservacion Eliminada");
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

//modificar reservacion
app.put("/reservacion/modificar", (req, res) => {
  const { id } = req.params;
  Reservacion.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .exec()
    .then(reservacion => {
      res.send(reservacion);
    })
    .catch(err => {
      res.status(409).send(err);
    });
});

//obtener todos los restaurantes
app.get("/restaurantes/", (req, res) => {
  Restaurante.find()
    .populate("menu")
    .exec()
    .then(restaurante => {
      res.send(restaurante);
    })
    .catch(err => {
      res.status(409).send(err);
    });
});

//get restaurante por id
app.get("/restaurante/:id", (req, res) => {
  const { id } = req.params;
  Restaurante.findById(id)
    .populate("menu")
    .exec()
    .then(restaurante => {
      res.send(restaurante);
    })
    .catch(err => {
      res.status(409).send(err);
    });
});

app.post("/restaurantes/registrar", (req, res) => {
  const JsonRestaurante = req.body;
  const nuevaRestaurante = Restaurante(JsonRestaurante);
  nuevaRestaurante.save((err, restaurante) => {
    err ? res.status(409).send(err) : res.status(201).send(restaurante);
  });
});

// Estas líneas de código van al final
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
