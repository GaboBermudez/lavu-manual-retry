
import { getCustomerData, getCustomerEmail, getCustomerField, getOrderData, getRowValue, roundAmount } from './LavuOrderUtils.js';
import { NombComercialConsts } from '../consts/Constants.js';
import Logger, { mailLogger } from '../logger/Logger.js';
import jsonTemplate from './InvoiceTemplate.js';

export function getJSONFromLavu(orderData) {
  const orderId = getRowValue(orderData, "order_id");
  const loggerOrden = Logger(orderId);
  loggerOrden.info(`DATOS DE ORDEN LAVU: \n ${JSON.stringify(orderData)}`);

  jsonTemplate.NumCuenta = process.env.GTI_CUENTA;
  jsonTemplate.Documentos[0].Encabezado.NombComercial = NombComercialConsts[process.env.NOMBRE_COMERCIAL];
  jsonTemplate.Documentos[0].Encabezado.NumeroFactura = orderId;
  jsonTemplate.Documentos[0].Encabezado.TipoDoc = 4;

  // TODO: REVISAR SI ES FACTURA O TIQUETE

  // CALCULO DE IMPUESTOS
  const total = getRowValue(orderData, "total");
  const totalPrecioUnitario = total;
  const totalIva = totalPrecioUnitario * 0.13;
  const totalImpServicio = totalPrecioUnitario * 0.10;
  const totalComprobante = totalPrecioUnitario + totalIva + totalImpServicio;

  jsonTemplate.Documentos[0].Lineas[0].PrecioUnitario = totalPrecioUnitario
  jsonTemplate.Documentos[0].Lineas[0].Impuestos[0].MontoImp = totalIva;
  jsonTemplate.Documentos[0].OtrosCargos[0].MontoCargo = totalImpServicio;
  jsonTemplate.Documentos[0].Totales.TotalOtrosCargos = totalImpServicio;
  jsonTemplate.Documentos[0].Totales.TotalImpuesto = totalIva;
  jsonTemplate.Documentos[0].Totales.TotalMercaGravada = totalPrecioUnitario
  jsonTemplate.Documentos[0].Totales.TotalGravado = totalPrecioUnitario
  jsonTemplate.Documentos[0].Totales.TotalVenta = totalPrecioUnitario
  jsonTemplate.Documentos[0].Totales.TotalVentaNeta = totalPrecioUnitario
  jsonTemplate.Documentos[0].Totales.TotalComprobante = Number(totalComprobante).toFixed(2);

  return totalComprobante === 0 ? false : jsonTemplate;
}


