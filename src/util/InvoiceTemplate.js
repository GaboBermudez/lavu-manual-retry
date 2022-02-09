export default {
  "NumCuenta": 0,
  "Documentos": [
    {
      "Encabezado": {
        "CodigoActividad": 551002, // Hotel
        "CondicionVenta": 1, 
        "MedioPago": [2], // 1: Efectivo, 2: Tarjeta
        "Moneda": 1,
        "NombComercial": "",
        "NumeroFactura": "", // Coordinar con Selina para enviar por acá el número de orden de Lavu
        "SituacionEnvio": 1,
        "Sucursal": 9,
        "Terminal": 9,
        "TipoDoc": 1, // 1: Factura, 4: Tiquete
      },
      "Lineas": [
        {
          "Cantidad": 1,
          "Codigo": 6331000000000,
          "UnidadMedida": 1,
          "Descripcion": "Suministro de comida, servicio de restaurante con mesero",
          "PrecioUnitario": 0,
          // "Descuentos": [
          //   {
          //     "MontoDescuento": 0,
          //     "DetalleDescuento": ""
          //    }
          // ],
          "Impuestos": [
            {
              "CodigoImp": 1, // IVA
              "CodigoTarifa": 8, // 13%
              "MontoImp": 0
            }
          ]
        }
      ],
      "OtrosCargos": [
        {
          "TipoDocumento": 6,
          "Detalle": "Impuesto de servicio",
          "Porcentaje": 10,
          "MontoCargo": 0
        },
      ],
      "Totales": {
        "TotalServGravado": 0,
        "TotalServExento": 0,
        "TotalServExonerado": 0,
        "TotalMercaGravada": 0,
        "TotalMercaExenta": 0,
        "TotalMercaExonerada": 0,
        "TotalGravado": 0,
        "TotalExento": 0,
        "TotalExonerado": 0,
        "TotalIVADevuelto": 0,
        "TotalOtrosCargos": 0,
        "TotalVenta": 0,
        "TotalDescuento": 0,
        "TotalVentaNeta": 0,
        "TotalImpuesto": 0,
        "TotalComprobante": 0
      },
    }
  ]
};