import chokidar from "chokidar";

export default function watchOutput(directories) {
  return {
    name: "watch-output",
    configureServer(server) {
      const watcher = chokidar.watch(directories, { 
        ignoreInitial: true,
        usePolling: true,
        interval:100
       });

      watcher.on("all", (event, path) => {
        console.log(`[Change Detected] ${event} on ${path}`);
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      });

      watcher.on("error", (error) => {
        console.error("[Watcher Error]", error);
      });
    },
  };
}
