import axios from 'axios';

class GTIService {
  constructor() {
    this.url = `https://pruebas.gticr.com/AplicacionFEPruebas/ApiCargaFactura/api/Documentos/CargarDocumento?pUsuario=${process.env.GTI_USUARIO}&pClave=${process.env.GTI_CLAVE}&pNumCuenta=${process.env.GTI_CUENTA}`;
  }

  postInvoice(payload) {
    return axios.post(this.url, payload);
  }
};

export default new GTIService();
