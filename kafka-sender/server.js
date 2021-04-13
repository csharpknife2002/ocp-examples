const express = require('express');
const {Kafka} = require('kafkajs');

const app = new express();
const kafka = new Kafka({
  clientId: 'my-sender',
  brokers:['my-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092']
});

const producer = kafka.producer();

const port = 8080;

app.get('/ping', (req,res)=> {
  res.status(200).send('pong');
})

app.get('/fire',async (req,res)=>{
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })  
  await producer.disconnect()
})

app.listen(port, async ()=> {
  console.log('http server start at port:', port);

  const consumer = kafka.consumer({ groupId: 'test-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })
});