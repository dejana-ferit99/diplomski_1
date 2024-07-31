class ApiNonStatic {
    formatDate() {
        const today = new Date();
    
        const month = String(today.getMonth() + 1).padStart(2, '');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        return `${month}-${day}-${year}`;
    }

    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
  
module.exports = new ApiNonStatic();  
