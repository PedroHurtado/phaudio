


export async function sendData(url, int16Array) {
    
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: int16Array,
  });

  if (!response.ok) {
    throw new Error(`Error al enviar: ${response.statusText}`);
  }

  return await response.json()
}
