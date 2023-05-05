export const parse = (v: string) => {
    try {
        return JSON.parse(v)
    } catch (error) {
        return v
    }
}

export const format = (v: any) => {
    return typeof v == "string" ? v : JSON.stringify(v)
}