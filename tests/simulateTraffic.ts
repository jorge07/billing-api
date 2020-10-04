import axios from "axios";
import * as v4 from "uuid/v4";

async function call() {
    let uuid: string;

    try {
        const response = await axios.post("http://127.0.0.1:8070/transaction", {
            price: {
                amount: Math.floor(Math.random() * (40 - 30)) + 30,
                currency: "EUR" },
            product: "demo",
            uuid: uuid = v4(),
        });

        console.log("Code: ", response.status);
        console.log(`http://127.0.0.1:8070/transaction/${uuid}`);

        setTimeout(async () => {
            await axios.get(`http://127.0.0.1:8070/transaction/${uuid}`);
            await axios.get(`http://127.0.0.1:8070/transaction/${uuid}`);
            await axios.get(`http://127.0.0.1:8070/transaction/${uuid}`);
            await axios.get(`http://127.0.0.1:8070/transaction/${uuid}`);
            await axios.get(`http://127.0.0.1:8070/transaction/${uuid}`);
        }, 100);

    } catch (err) {
        console.log(err.message);
    }
}

(function loop(iteration) {
    setTimeout(async () => {
        if (--iteration) {
            await call();
            loop(iteration);
        }
    }, 300);
})(100);
