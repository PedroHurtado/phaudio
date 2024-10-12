export function serialize(jsonObject, binaryData) {
    // Serializar el objeto JSON a una cadena
    const jsonString = JSON.stringify(jsonObject);
    
    // Convertir la cadena JSON en un Uint8Array
    const jsonBuffer = new TextEncoder().encode(jsonString);
    
    // Crear un nuevo Uint8Array que almacenará la longitud del JSON (4 bytes) y los datos
    const totalLength = 4 + jsonBuffer.length + binaryData.length;
    const resultArray = new Uint8Array(totalLength);
    
    // Almacenar la longitud del JSON en los primeros 4 bytes
    const jsonLength = jsonBuffer.length;
    resultArray[0] = (jsonLength >> 24) & 0xFF; // Byte más significativo
    resultArray[1] = (jsonLength >> 16) & 0xFF;
    resultArray[2] = (jsonLength >> 8) & 0xFF;
    resultArray[3] = jsonLength & 0xFF;         // Byte menos significativo
    
    // Copiar los datos del JSON al array resultante
    resultArray.set(jsonBuffer, 4);
    
    // Copiar los datos binarios después del JSON
    resultArray.set(binaryData, 4 + jsonBuffer.length);
    
    return resultArray;
}

export function deserialize(dataArray) {
    // Recuperar la longitud del JSON desde los primeros 4 bytes
    const jsonLength = (dataArray[0] << 24) | (dataArray[1] << 16) | (dataArray[2] << 8) | dataArray[3];
    
    // Extraer los datos del JSON
    const jsonBuffer = dataArray.slice(4, 4 + jsonLength);
    const jsonString = new TextDecoder().decode(jsonBuffer);
    const jsonObject = JSON.parse(jsonString);
    
    // Extraer los datos binarios (el resto del Uint8Array)
    const binaryData = dataArray.slice(4 + jsonLength);
    
    return {
        object: jsonObject,
        binaryData: binaryData
    };
}

