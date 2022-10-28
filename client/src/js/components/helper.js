const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

export const helper = {
    capitaliseFirstLetter: word => word.charAt(0).toUpperCase() + word.slice(1),
    convertCentsToDollars: number => `$${(number/100).toFixed(2)}`,
    getFullDate: (date) => {
        const d = new Date(date);
        return `${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`
    },
    getDay: (date) => {
        const d = new Date(date);
        return d.getDate()
    },
    getMonth: (date) => {
        const d = new Date(date);
        return month[d.getMonth()]
    },
    setSessionWithExpiry: (key, userId, ttl) => {
        const now = new Date();
        const session = {
            userId: userId,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(session));
    },
    getSessionWithExpiry: (key) => {
        const keyExists = localStorage.getItem(key)
        // console.log('keyExists', keyExists)
        // if the item doesn't exist, return null
        if (!keyExists) {
            return null
        };
        const session = JSON.parse(keyExists);
        const now = new Date();
        // compare the expiry time of the item with the current time
        if (now.getTime() > session.expiry) {
            localStorage.removeItem(key)
            return null
        } else {
            return session.userId 
        };        
    }
};