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
      await run_shell_command(`certbot delete -q --cert-name ${subdomain_info.prefix}.dynamicsoft.tech`);    
      await run_shell_command(`certbot --nginx -d ${subdomain_info.prefix}.dynamicsoft.tech`).then(() => {
        res.status(200).send({message:'SSL setup done!'});
       });    
     }
     else{       
          res.status(300).send({ error: 'Subdomain prefix is required.' });
     }
}
