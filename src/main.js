import {init, config} from '@audiorecorder/client'

config.silero.url = "/packages/worker_silero/dist/index.js"
config.url_worker_audio = "/packages/worker_audio/dist/index.js"
config.url_server = 'http://localhost:3000'

init();