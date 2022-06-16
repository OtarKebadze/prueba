const express = require("express");
const producto = require("./productos");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//URL PARA VER TODOS LOS PRODUCTOS DE LA TABLA
router.get("/productos", (req, res) => {
  producto.getAll().then((resp) => console.log(resp));
  producto.getAll().then((resp) => res.send(JSON.stringify(resp)));
});

router.post("/productos", (req, res) => {
  producto
    .save(req.body)
    .then(() => producto.getAll().then(() => res.redirect("/api/")));
  console.log("PRODUCTO AGREGADO DE MANERA EXITOSA");
});

router.delete("/productos/:id", (req, res) => {
  let num = parseInt(req.params.id);
  if (isNaN(num) || num < 0)
    return res.status(400).send({ error: "ID INVALIDO" });
  producto.getById(num).then((resp) => {
    if (resp === undefined)
      return res.send({ error: "producto no encontrado" });
    else {
      producto.deleteById(num);
    }
  });
  //LE PUSE UN SET TIME OUT, PORQUE SINO ME DEVOLVIA UN JSON SIN ACTUALIZAR,
  //PERO ME BORRABA EL PRODUCTO DEL TXT
  setTimeout(() => {
    return producto.getAll().then((resp) =>
      res.send(`
        ${JSON.stringify(resp)}
        `)
    );
  }, 500);
});

router.delete("/productos", (req, res) => {
  producto.deteleAll().then(() => res.send("ELIMINADO CON EXITO"));
});

module.exports = router;
