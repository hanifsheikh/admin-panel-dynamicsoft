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
     if(subdomain_info.domain_name === subdomain_info.domainToDelete){
        
      await run_shell_command(`
      crontab -l | sed '/${subdomain_info.domainToDelete}/d' | crontab - &&
      rm -rf /var/www/apps/${subdomain_info.domainToDelete} && 
      rm /etc/nginx/sites-available/${subdomain_info.domainToDelete} && 
      rm /etc/nginx/sites-enabled/${subdomain_info.domainToDelete} && 
      mysql -e "drop database dynamicsoft_${subdomain_info.domainToDelete.split('.')[0]}" && 
      certbot delete -q --cert-name ${subdomain_info.domainToDelete}`).then( output => {           
         res.status(200).send({message:  subdomain_info.domain_name + 'has been deleted!'});
       });   
        }
     else{       
          res.status(406).send({ error: 'Domain name Mismatch' });
     }
}
