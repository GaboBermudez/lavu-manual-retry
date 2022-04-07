
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

  const receptor = getCustomerData(orderData);

  if (receptor) {
    const cedFisicaRegex = /^[1-7][0-9]{8}$/;
    const cedJuridicaRegex = /^[1-7][0-9]{9}$/;
    const cedulaReceptor = getCustomerField(receptor, 'Last_Name') || '';

    if (cedFisicaRegex.test(cedulaReceptor) || cedJuridicaRegex.test(cedulaReceptor)) {
      const customerEmail = getCustomerEmail(orderData);
      jsonTemplate.Documentos[0].Encabezado.Receptor = {};
      jsonTemplate.Documentos[0].Encabezado.Receptor.Nombre = getCustomerField(receptor, 'First_Name') || '';
      jsonTemplate.Documentos[0].Encabezado.Receptor.Correo = customerEmail || '';
      jsonTemplate.Documentos[0].Encabezado.Receptor.Identificacion = cedulaReceptor;
      jsonTemplate.Documentos[0].Encabezado.Receptor.TipoIdent = cedFisicaRegex.test(cedulaReceptor) ? 1 : 2;
      jsonTemplate.Documentos[0].Encabezado.TipoDoc = 1;
    }
  }


  // CALCULO DE IMPUESTOS
  const total = Number(getRowValue(orderData, "total"));
  let totalPrecioUnitario = total / 1.23;
  totalPrecioUnitario = roundAmount(totalPrecioUnitario);
  let totalImpServicio = totalPrecioUnitario * 0.10;
  let totalIva = totalPrecioUnitario * 0.13;
  totalImpServicio = roundAmount(totalImpServicio);
  totalIva = roundAmount(totalIva);
  let totalComprobante = (totalPrecioUnitario + totalIva + totalImpServicio)
      .toString().match(/^-?\d+(?:\.\d{0,6})?/)[0];
  totalComprobante = Number(totalComprobante);

  jsonTemplate.Documentos[0].Lineas[0].PrecioUnitario = totalPrecioUnitario.toFixed(5)
  jsonTemplate.Documentos[0].Lineas[0].Impuestos[0].MontoImp = totalIva.toFixed(5);
  jsonTemplate.Documentos[0].OtrosCargos[0].MontoCargo = totalImpServicio.toFixed(5);
  jsonTemplate.Documentos[0].Totales.TotalOtrosCargos = totalImpServicio.toFixed(5);
  jsonTemplate.Documentos[0].Totales.TotalImpuesto = totalIva.toFixed(5);
  jsonTemplate.Documentos[0].Totales.TotalMercaGravada = totalPrecioUnitario.toFixed(5);
  jsonTemplate.Documentos[0].Totales.TotalGravado = totalPrecioUnitario.toFixed(5);
  jsonTemplate.Documentos[0].Totales.TotalVenta = totalPrecioUnitario.toFixed(5);
  jsonTemplate.Documentos[0].Totales.TotalVentaNeta = totalPrecioUnitario.toFixed(5);
  jsonTemplate.Documentos[0].Totales.TotalComprobante = totalComprobante.toFixed(5);

  return totalComprobante === 0 ? false : jsonTemplate;
}
