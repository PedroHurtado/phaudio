export async function getData(response) {
    if (response.headers.get('Content-Type')
        .includes('application/json')) {    
        return await response.json()
    }
    return await response.text()
}