// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const util = require("util");
const exec = require('child_process').exec;
const execProm = util.promisify(exec); 
const fs = require('fs');

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
      let application_path = '/var/www/apps/'+subdomain_info.prefix+'.dynamicsoft.tech'
 
      if (fs.existsSync(application_path)) { 
       res.status(302).send({ error: application_path + ' folder already exist.'})
     }    
     else {
      await run_shell_command(`      
      subdomain=${subdomain_info.prefix} 
      maindomain='dynamicsoft.tech'
      fulldomain=$subdomain'.'$maindomain &&
      mkdir -p /var/www/apps/$fulldomain &&
      cd ~/dynamic-soft-school/ && git pull && 
      rsync -a ~/dynamic-soft-school/ /var/www/apps/$fulldomain/`).then((output) => {         
        if(output?.stderr){
           res.status(500).send({ error: 'Application installation failed.' }) 
        } 
        else {
          res.status(200).send({message: subdomain_info.prefix + '.dynamicsoft.tech' + ' application has been installed!'});
        }
      }).catch((e) => {
        res.status(500).send({ error: 'Application installation failed.' }) 
      })
    }        
     }
     else{       
          res.status(300).send({ error: 'Subdomain prefix is required.' });
     }
}
