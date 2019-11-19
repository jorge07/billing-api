import KernelFactory, { Kernel } from './src/kernel';
import { Channel, Message } from 'amqplib';
import TransactionWasCreated from './src/domain/transaction/events/transactionWasCreated';
import Price from 'domain/transaction/valueObject/price';
import AMPQChannel from 'infrastructure/shared/rabbitmq/channel';
import { Domain } from 'hollywood-js';

(async ()=> {
    try {
        const kernel: Kernel = await KernelFactory(false);

        const channel = kernel.container.get<AMPQChannel>('infrastructure.transaction.rabbitmq.connection');
    
        channel.publish('events', 'transactions.TransactionWasCreated', JSON.stringify(Domain.DomainMessage.create(
            "255edcfe-0622-11ea-8d71-362b9e155667", 
            0,
            new TransactionWasCreated("255edcfe-0622-11ea-8d71-362b9e155667", "ooo", new Price(1, 'EUR')), [])));

        await channel.close();

    } catch(error) {
        console.log(error.message);
    }
})()