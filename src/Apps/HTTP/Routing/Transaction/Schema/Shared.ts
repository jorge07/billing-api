const TransactionResponse = {
    data: {
        properties: {
            createdAt: { type: "string" },
            priceAmount: { type: "string" },
            priceCurrency: { type: "string" },
            product: { type: "string" },
            uuid: { type: "string" },
        },
        type: "object",
    },
    meta: {
        items: {
            type: "object",
        },
        type: "array",
    },
};

export {
    TransactionResponse,
};
