export function serialize(json, int16Array) {
    // Convertir el JSON a Uint8Array utilizando TextEncoder
    const jsonString = JSON.stringify(json);
    const jsonBytes = new TextEncoder().encode(jsonString);
    const jsonLength = jsonBytes.length;

    // Crear un buffer con tamaño suficiente para todos los datos
    const buffer = new ArrayBuffer(2 + jsonLength + int16Array.length * 2); // 2 bytes para la longitud del JSON + JSON + Int16Array
    const view = new DataView(buffer);

    // Guardar la longitud del JSON en los primeros 2 bytes
    view.setUint16(0, jsonLength, true); // true para little-endian

    // Guardar el Uint8Array del JSON
    let offset = 2;
    for (let i = 0; i < jsonLength; i++) {
        view.setUint8(offset++, jsonBytes[i]);
    }

    // Guardar los datos del Int16Array
    for (let i = 0; i < int16Array.length; i++) {
        view.setInt16(offset, int16Array[i], true); // true para little-endian
        offset += 2;
    }

    return buffer;
}

export function deserialize(buffer) {
    const view = new DataView(buffer);

    // Leer la longitud del JSON (primeros 2 bytes)
    const jsonLength = view.getUint16(0, true); // true para little-endian

    // Leer el JSON desde el buffer y convertirlo de Uint8Array a cadena
    const jsonBytes = new Uint8Array(buffer, 2, jsonLength);
    const jsonString = new TextDecoder().decode(jsonBytes);
    const json = JSON.parse(jsonString);

    // Leer el Int16Array desde el buffer
    const int16ArrayStart = 2 + jsonLength;
    const int16ArrayLength = (buffer.byteLength - int16ArrayStart) / 2;
    const int16Array = new Int16Array(int16ArrayLength);
    for (let i = 0; i < int16ArrayLength; i++) {
        int16Array[i] = view.getInt16(int16ArrayStart + i * 2, true); // true para little-endian
    }

    return { json, file:int16Array };
}


