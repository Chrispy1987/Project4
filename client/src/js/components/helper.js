export const helper = {
    capitaliseFirstLetter: word => word.charAt(0).toUpperCase() + word.slice(1),
    convertCentsToDollars: number => `$${(number/100).toFixed(2)}`
};