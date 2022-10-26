export const helper = {
    capitaliseFirstLetter: word => word.charAt(0).toUpperCase() + word.slice(1),
    convertCentsToDollars: number => `$${(number/100).toFixed(2)}`,
    getDay: (date) => {
        const d = new Date(date);
        return d.getDate()
    },
    getMonth: (date) => {
        const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
        const d = new Date(date);
        return month[d.getMonth()]
    }
};