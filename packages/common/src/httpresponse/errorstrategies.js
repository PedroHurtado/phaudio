import {
    BadRequest,
    NotAllowed,
    Forbidden,
    InternalError,
    NotAutorized,
    NotFound
} from './customerrors.js'
import { getData } from './getdata.js'
export const ErrorsEstrategy = {
    '404': async (res) => { throw new NotFound() },
    '401': async (res) => { throw new NotAutorized()},
    '403': async (res) => { throw new Forbidden() },
    '400': async (res) => {throw new BadRequest(data)},    
    '405': async (res) => { throw new NotAllowed()},
    '500': async (res) => {throw new InternalError(data)},
}