export interface Country {
    name: string,
    capitalCity: string,
    incomeLevel: {
        [value: string]: string
    },
    region: {
        [value: string]: string
    },
    latitude: string,
    longitude: string
}
