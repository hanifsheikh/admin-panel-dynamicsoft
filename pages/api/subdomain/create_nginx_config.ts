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
     let config_path = '/etc/nginx/sites-available/'+subdomain_info.prefix+'.dynamicsoft.tech'
 
     if (fs.existsSync(config_path)) { 
      res.status(302).send({ error: 'NGINX subdomain config already exist.'})
    }    
    else {
      await run_shell_command(`      
      subdomain=${subdomain_info.prefix} 
      maindomain='dynamicsoft.tech'
      fulldomain=$subdomain'.'$maindomain &&
      cp /etc/nginx/sites-available/subdomain-config /etc/nginx/sites-available/$fulldomain &&
      sed -i 's/subdomain/'$subdomain'/g' /etc/nginx/sites-available/$fulldomain &&
      ln -s /etc/nginx/sites-available/$fulldomain /etc/nginx/sites-enabled/$fulldomain`).then((output) => {         
        if(output?.stderr){
           res.status(500).send({ error: 'NGINX subdomain config creation failed.' }) 
        } 
        else {
          res.status(200).send({message: subdomain_info.prefix + '.dynamicsoft.tech' + ' NGINX config has been created!'});
        }
      }).catch((e) => {
        res.status(500).send({ error: 'NGINX subdomain config creation failed.' }) 
      })
    } 
     }
     else{       
         res.status(406).send({ error: 'Subdomain prefix is required.' });
     }
}
