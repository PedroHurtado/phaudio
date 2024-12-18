import { mkdir, readdir, copyFile, rm } from 'fs/promises';
import { join } from 'path';

export async function copyFilesIterative(source, destination) {

    await rm(destination, { recursive: true, force: true });
    await mkdir(destination, { recursive: true });


    const queue = [{ source, destination }];

    while (queue.length > 0) {
        const { source: currentSource, destination: currentDestination } = queue.pop();


        const items = await readdir(currentSource, { withFileTypes: true });

        for (const item of items) {
            const sourcePath = join(currentSource, item.name);
            const destinationPath = join(currentDestination, item.name);

            if (item.isDirectory()) {

                await mkdir(destinationPath, { recursive: true });
                queue.push({ source: sourcePath, destination: destinationPath });
            } else if (item.isFile()) {
                await copyFile(sourcePath, destinationPath);

            }
        }
    }

}


const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error('Uso: node copyFiles.js <directorio_origen> <directorio_destino>');
    process.exit(1);
}

const [sourceDir, destinationDir] = args;


copyFilesIterative(sourceDir, destinationDir)
    .then(() => console.log('Copia completada.'))
    .catch((err) => console.error(`Error general: ${err.message}`));