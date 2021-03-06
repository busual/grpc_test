import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './proto/random'

const PORT = 8082
const PROTO_FILE = './proto/random.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType


const client = new grpcObj.randomPackage.Random(
    `0.0.0.0:${PORT}`, grpc.credentials.createInsecure()
  )
  
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5)
  client.waitForReady(deadline, (err) => {
    if (err) {
      console.error(err)
      return
    }
    onClientReady()
  })
  
  
  function onClientReady() {
    client.PingPong({message: "Hi"}, (err, result) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(result)
    })

    const stream1 = client.RandomNumbers({maxVal: 12})
  stream1.on("data", (chunk)=> {
    console.log(chunk)
  })
  stream1.on("end", () => {
    console.log("communication ended")
  })

  const stream2 = client.TodoList((err, result) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(result)
  })
  stream2.write({todo: "Work from home", status: "Doing"})
  stream2.write({todo: "Vist the office", status: "Have to do"})
  stream2.write({todo: "Start working on POC", status: "Doing"})
  stream2.write({todo: "Submit the POC", status: "will do"})
  stream2.end()
  }