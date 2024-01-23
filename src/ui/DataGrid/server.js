const Server = {

    demoData : [],
    generateNumber : numberOfDigits => Math.floor(Math.random() * Math.pow(10, numberOfDigits)),

    getNumberInRange : (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    generateDemoRecord : () => {
        return [Server.generateNumber(15),
            `${Server.getNumberInRange(10, 28)}/${Server.getNumberInRange(10, 12)}/${Server.getNumberInRange(2018, 2022)}`,
            Server.getNumberInRange(0, 2),
            `${Server.getNumberInRange(10, 28)}/${Server.getNumberInRange(10, 12)}/2023`,
            Server.getNumberInRange(1000, 1000000)];
    },

    getRecords : (startPos = 0, numRecords = 10) => {

        const NumRecords = 100;
        if (Server.demoData.length === 0) {
            for (let i = 0; i < NumRecords; i++) {
                Server.demoData.push(Server.generateDemoRecord());
           }
        }

        const partialView = Server.demoData.slice(startPos, startPos + numRecords);

        return {
            records : partialView,
            numRecords: NumRecords
        };
    },
};


export {Server};