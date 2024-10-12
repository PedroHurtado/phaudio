
const URL = process.env.OPENAI_URL
const token = process.env.OPENAI_TOKEN  

export async function transcribe(data) {    
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("response_format", "vtt");  
  formData.append("languaje", "es");
  formData.append("file", createFile(data));
  const response = await fetch(URL, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.status)
  return await response.text();
}
function createFile(data) {
  return new File([data], "file.webm", {});
}
