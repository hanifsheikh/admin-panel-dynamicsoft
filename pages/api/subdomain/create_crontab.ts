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
      await run_shell_command(`crontab -l | grep -n "\\[ ${subdomain_info.prefix}.dynamicsoft.tech ]" | cut -f1 -d:`).then( output => {
        let line_number = output.stdout  
        if(line_number) {      
          res.status(302).send({ error: 'Crontab already exist.' });
         }  
       });   
      await run_shell_command(`crontab -l > cronjobs && 
      echo "\n### --------------------- [ ${subdomain_info.prefix}.dynamicsoft.tech ] ---------------------###\n" >> cronjobs &&
      tr -d "\r" <cronjobs > cronjobs_unix && crontab cronjobs_unix && crontab -l | cat -s | crontab -`).then( output => {           
         res.status(200).send({message: 'Crontab for ' + subdomain_info.prefix + '.dynamicsoft.tech is created.'});
       });   
        }
     else{       
          res.status(406).send({ error: 'Subdomain prefix is required.' });
     }
}
