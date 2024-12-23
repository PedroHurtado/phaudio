import { strategies } from "./strategies.js"
export async function resolve(response) {
    const { status } = response
    return await strategies[status](response)
}