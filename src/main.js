import { getJSONFromLavu } from './util/LavuToGTI.js';
import { getRowValue } from './util/LavuOrderUtils.js';
import LavuService from './services/LavuService.js';
import Logger from './logger/Logger.js';
import GTService from './services/GTIService.js';

async function main() {
  const loggerGeneral = Logger();
  const orderId = process.argv[2];
  try {
    loggerGeneral.info('----- INICIO DE EJECUCION -----');
    // INICIALIZACION DE LOGGERS
    const loggerOrden = Logger(orderId);
    loggerGeneral.info(`ORDEN: ${orderId}`);
    loggerOrden.info(`ORDEN: ${orderId}`);

    // CONSULTA A LAVU POR ORDEN
    const orderToSubmit = await LavuService.getOrderGeneralInfo(orderId);

    const jsonToGTI = getJSONFromLavu(orderToSubmit.elements[0]);
    loggerOrden.info(`JSON PARA GTI: \n ${JSON.stringify(jsonToGTI)}`);



    const result = await GTService.postInvoice(jsonToGTI);
    loggerOrden.info(`Respuesta de GTI: \n${JSON.stringify(result)}`);

    return;
    // SI ES DE SELINA NO SE HACE DOCUMENTO
    if ((exemption && exemption === '1004') || !jsonToGTI) {
      loggerOrden.info('Es cuenta de Selina o cuenta en cero. NO SE HACE FACTURA.')
    }
    else { // SE HACE DOCUMENTO ELECTRONICO

      const result = await GTService.postInvoice(jsonToGTI);
      loggerOrden.info(`Respuesta de GTI: \n${JSON.stringify(result)}`);

      if (result.data.Respuestas[0].Error === 'Exitoso') {
        loggerOrden.info('EXITO envio de documento');
        loggerGeneral.info('EXITO envio de documento');
      }
      else {
        loggerOrden.info(`Orden: ${orderId} \n\nRespuesta de GTI: \n${result.data.Respuestas[0]}`)
        loggerOrden.info('FALLO envio de documento');
        loggerGeneral.info('FALLO envio de documento');
      }
    }

    loggerGeneral.info('----- FIN DE EJECUCION ------');
  }
  catch (err) {
    // loggerOrden.info(`Orden: ${orderId} \nError: ${err}`);
    loggerGeneral.info('ERROR: ', err)
  };
}

export default main;
