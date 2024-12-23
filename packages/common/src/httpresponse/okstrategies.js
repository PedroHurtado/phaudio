import {getData} from './getdata.js';

export const OKEstrategy ={
    '204': async (res)=> "",
    '201': async (res)=> await getData(res),
    '200': async (res)=> await getData(res)
}