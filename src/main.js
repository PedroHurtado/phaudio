import {init, config} from '@audiorecorder/client'

config.silero.url = "/test/worker_silero/index.js"
config.url_worker_audio = "/test/worker_audio/index.js"
config.url_server = 'http://localhost:3000'

init();