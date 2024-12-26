import { spawnSync } from "child_process";
import { resolve } from "path";
import { fileURLToPath } from "url";

// Calcula el directorio raíz del proyecto (2 niveles hacia arriba)
const rootDir = resolve(fileURLToPath(import.meta.url), "../../");

// Define las dependencias que deseas instalar/desinstalar
const dependencies = ["@audiorecorder/worker_audio", "@audiorecorder/worker_silero"];

// Determina la acción a realizar (install o uninstall)
const action = process.argv[2] === "uninstall" ? "uninstall" : "install";

// Ejecuta el comando npm de forma multiplataforma
try {
  console.log(`Running npm ${action} for ${dependencies.join(", ")} in ${rootDir}`);

  const result = spawnSync(
    "npm",
    [action, "--no-save", ...dependencies],
    {
      cwd: rootDir, // Cambia el directorio de trabajo al raíz del proyecto
      stdio: "inherit", // Muestra la salida directamente en la consola
      shell: false // No dependemos de ningún shell del sistema operativo
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`npm ${action} failed with exit code ${result.status}`);
  }

  console.log(`Successfully ran npm ${action}`);
} catch (error) {
  console.error(`Failed to ${action} dependencies:`, error.message);
  process.exit(1);
}
