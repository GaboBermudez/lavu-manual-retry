
import { getCustomerData, getCustomerEmail, getCustomerField, getOrderData, getRowValue, roundAmount } from './LavuOrderUtils.js';
import { NombComercialConsts } from '../consts/Constants.js';
import Logger, { mailLogger } from '../logger/Logger.js';
import jsonTemplate from './InvoiceTemplate.js';
import LavuService from '../services/LavuService.js';

export async function getJSONFromLavu(orderId) {
  const loggerOrden = Logger(orderId);
  // const orderData = getOrderData(orders, orderId);
  const result = await LavuService.getOrderGeneralInfo(orderId);
  loggerOrden.info(`DATOS DE ORDEN LAVU: \n ${JSON.stringify(result)}`);
  // console.log(result);
  const orderData = result.elements[0];
  jsonTemplate.NumCuenta = process.env.GTI_CUENTA;
  jsonTemplate.Documentos[0].Encabezado.NombComercial = NombComercialConsts[process.env.NOMBRE_COMERCIAL];
  jsonTemplate.Documentos[0].Encabezado.NumeroFactura = orderId;
  jsonTemplate.Documentos[0].Encabezado.TipoDoc = 4;

  totalPrecioUnitario = roundAmount(totalPrecioUnitario);//Proceso de de cálculo para impuestos
  const totalIva = roundAmount(totalPrecioUnitario * 0.13);
  const totalImpServicio = roundAmount(totalPrecioUnitario * 0.10);
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
  jsonTemplate.Documentos[0].Totales.TotalComprobante = totalComprobante.toFixed(2);

  return totalComprobante === 0 ? false : jsonTemplate;
}


