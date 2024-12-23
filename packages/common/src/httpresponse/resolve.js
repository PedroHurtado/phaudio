import { strategies } from "./strategies.js"
export async function resolve(response) {
    const { status } = response
    return await estrategies[status](response)
}