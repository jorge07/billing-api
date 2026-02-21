import axios from "axios";
import { v4 } from "uuid";

async function call() {
    let uuid: string;

    try {
        const response = await axios.post("http://127.0.0.1:8080/transaction", {
            price: {
                amount: Math.floor(Math.random() * (40 - 30)) + 30,
                currency: "EUR" },
            product: "demo",
            uuid: uuid = v4(),
        });

        console.log("Code: ", response.status);
        console.log(`http://127.1:8080/transaction/${uuid}`);

        setTimeout(async () => {
            await Promise.all([
                axios.get(`http://127.0.0.1:8080/transaction/${uuid}`),
                axios.get(`http://127.0.0.1:8080/transaction/${uuid}`),
                axios.get(`http://127.0.0.1:8080/transaction/${uuid}`),
                axios.get(`http://127.0.0.1:8080/transaction/${uuid}`),
                axios.get(`http://127.0.0.1:8080/transaction/${uuid}`),
            ])
         }, 80);

    } catch (err) {
        console.log(err.message);
    }
}

(function loop(iteration: number) {
    setTimeout(async () => {
        if (--iteration) {
            await call();
            loop(iteration);
        }
    }, 50);
})(500); // Generate 500 transactions
