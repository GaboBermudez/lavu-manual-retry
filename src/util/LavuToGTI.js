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

  const receptor = getCustomerData(orderData);
  // console.log(JSON.stringify(customerEmail));
  const customerEmail = getCustomerEmail(orderData);
  return;
  // console.log(getCustomerField(receptor, 'Email'));
  if (receptor) {
    const cedFisicaRegex = /^[1-7][0-9]{8}$/;
    const cedJuridicaRegex = /^[1-7][0-9]{9}$/;
    const cedulaReceptor = getCustomerField(receptor, 'Last_Name') || '';
    if (cedFisicaRegex.test(cedulaReceptor) || cedJuridicaRegex.test(cedulaReceptor)) {
      jsonTemplate.Documentos[0].Encabezado.Receptor = {};
      jsonTemplate.Documentos[0].Encabezado.Receptor.Nombre = getCustomerField(receptor, 'First_Name') || '';
      jsonTemplate.Documentos[0].Encabezado.Receptor.Correo = getCustomerField(receptor, 'Email') || '';
      jsonTemplate.Documentos[0].Encabezado.Receptor.Identificacion = cedulaReceptor;
      jsonTemplate.Documentos[0].Encabezado.Receptor.TipoIdent = 1;
      jsonTemplate.Documentos[0].Encabezado.TipoDoc = 1;
    }
  }


  const orderContents = await LavuService.getOrderContents(orderId);
  // const orderContents = await LavuService.getOrderContents('1002-41576');
  let totalPrecioUnitario = 0;
  
  loggerOrden.info(`ORDER CONTENTS: \n ${JSON.stringify(orderContents)}`);

  orderContents[0].elements.forEach((item) => {
    let newPrecioUnitario = parseFloat(getRowValue(item, 'tax_subtotal1'));
    let newIVA = parseFloat(getRowValue(item, 'tax1'));
    let newImpServicio = parseFloat(getRowValue(item, 'tax2'));

    if (newPrecioUnitario) {
      
      // Si no tiene los impuestos programados en LAVU
      if (!newIVA || !newImpServicio) {
        loggerOrden.info('No tiene impuestos en LAVU');
        newPrecioUnitario = newPrecioUnitario / 1.23;
      }
      totalPrecioUnitario += newPrecioUnitario;
    }
    else {
      mailLogger.info(`Orden: ${orderId} \nWarning: La cuenta tiene item con precio unitario nulo`);
    }
  });
 
  totalPrecioUnitario = roundAmount(totalPrecioUnitario);
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
