const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../db/db');

router.get('/', (req, res) => {
       mysqlConnection.query('SELECT * FROM compras', (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
  });

  router.post('/', (req,res)=>{
  const {orden, subtotal, iva, total} = req.body;
  let compra = {orden, subtotal, iva, total};
  let newCompra = `INSERT INTO compras (orden, subtotal, iva, total) VALUES ("` + compra.orden + `", "` + compra.subtotal + `", "` + compra.iva + `", "` + compra.total + `")`; 
  mysqlConnection.query(newCompra, compra, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    res.json({ message: "Compra realizada correctamente",
               success: true })
    });
  });  

module.exports = router;