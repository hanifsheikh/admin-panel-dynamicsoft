// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next' 
const util = require("util");
const exec = require('child_process').exec;
const execProm = util.promisify(exec);  
async function run_shell_command(command:string) {
  let result; 
  try { 
    result = await execProm(command);
  } catch(ex) {
     result = ex;   
  }
  if ( Error[Symbol.hasInstance](result) )
      return ;

  return result;
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse 
  ) {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }   
    let subdomain_info = req.body;    
     if(subdomain_info.prefix){
     let db_name = 'dynamicsoft_'+subdomain_info.prefix  
     await run_shell_command(`mysql -e "show databases like '${db_name}'"`).then((output) => {         
       if(output?.stdout){  
          res.status(302).send({ error: 'Database already exist.' }); 
        }
        else {
          run_shell_command(`mysql -e 'CREATE DATABASE ${db_name}'`).then((result) => {
            if(result?.stderr){
              res.status(500).send({ error: 'Database creation failed.' }); 
            } 
          })
          res.status(200).json({message: 'Database '+ db_name +' has been created!'});
        } 
      }) 
    }
     else{       
          res.status(406).send({ error: 'Subdomain prefix is required.' });
     }
}
