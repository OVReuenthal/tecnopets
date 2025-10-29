// controllers/exchangeRateController.js
export const getExchangeRate = async (req = request, res = response) => {
  try {
    console.log('Obteniendo tasa de cambio desde ve.dolarapi.com...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Tecnopets/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Respuesta de dolarapi:', data);
    
    // La estructura de ve.dolarapi.com es diferente
    const exchangeRate = data?.venta || data?.compra || data?.promedio;
    
    if (!exchangeRate || isNaN(parseFloat(exchangeRate))) {
      throw new Error('Tasa de cambio no válida en la respuesta');
    }

    const rate = parseFloat(exchangeRate);
    
    console.log(`Tasa BCV obtenida: ${rate} Bs/USD`);
    
    res.status(200).json({ 
      status: "Ok", 
      exchangeRate: rate,
      lastUpdated: new Date().toISOString(),
      source: "ve.dolarapi.com"
    });
    
  } catch (error) {
    console.error('Error en getExchangeRate:', error);
    
    // En caso de error, devolver una tasa por defecto pero informar el error
    res.status(200).json({ 
      status: "Ok", 
      exchangeRate: 35.00, // Tasa por defecto
      lastUpdated: new Date().toISOString(),
      source: "default",
      note: "Tasa por defecto por error: " + error.message
    });
  }
};