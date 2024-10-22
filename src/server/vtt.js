function timeToMilliseconds(time) {
    const [hours, minutes, seconds] = time.split(':');
    const [secs, millis] = seconds.split('.');
    
    return (parseInt(hours, 10) * 3600000) +
           (parseInt(minutes, 10) * 60000) +
           (parseInt(secs, 10) * 1000) +
           parseInt(millis, 10);
}

function convertVTTToMilliseconds(vttContent) {
    const lines = vttContent.split('\n');
    let result = [];
    let currentText = '';
    
    lines.forEach((line, index) => {
        const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/);
        if (timeMatch) {
            if (result.length > 0 && currentText) {
                result[result.length - 1].text = currentText.trim();
            }
            const startTime = timeToMilliseconds(timeMatch[1]);
            const endTime = timeToMilliseconds(timeMatch[2]);
            result.push({
                start: startTime,
                end: endTime,
                text: ''  // Inicializa la propiedad text aquí
            });
            currentText = '';
        } else if (line.trim() && !line.match(/^\d+$/)) {
            currentText += line + ' ';
        }
    });
    
    if (result.length > 0 && currentText) {
        result[result.length - 1].text = currentText.trim();
    }

    return result;
}

const vttContent = `
WEBVTT

1
00:00:00.000 --> 00:00:05.000
Este es un ejemplo de subtítulo para los primeros 5 segundos.

2
00:00:05.001 --> 00:00:10.000
Aquí aparece otro subtítulo durante los próximos 5 segundos.
`;

const millisecondsIntervals = convertVTTToMilliseconds(vttContent);
console.log(millisecondsIntervals);
