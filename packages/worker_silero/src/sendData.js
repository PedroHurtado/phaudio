
import {get} from '@audiorecorder/common'

export async function sendData(url, int16Array) {
  
  const {schema,token} = await get('user') || {};

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Authorization": `${schema} ${token}` 
    },
    body: int16Array,
  });

  if (!response.ok) {
    throw new Error(`Error al enviar: ${response.statusText}`);
  }

  return await response.json()
}
