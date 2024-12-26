import { execSync } from "child_process";
import { resolve } from "path";

// Calcula el directorio raíz del proyecto (2 niveles hacia arriba)
const rootDir = resolve(new URL(import.meta.url).pathname, "../../");

// Define las dependencias que deseas instalar/desinstalar
const dependencies = ["@audiorecorder/worker_audio", "@audiorecorder/worker_silero"];

// Determina la acción a realizar (install o uninstall)
const action = process.argv[2] === "uninstall" ? "uninstall" : "install";

try {
  console.log(`Running ${action} for ${dependencies.join(", ")} in ${rootDir}`);
  execSync(`npm ${action} --no-save ${dependencies.join(" ")}`, { cwd: rootDir, stdio: "inherit" });
} catch (error) {
  console.error(`Failed to ${action} dependencies`, error);
  process.exit(1);
}
