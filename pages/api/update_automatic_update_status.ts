// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const util = require("util");
const exec = require('child_process').exec;
const execProm = util.promisify(exec); 
     
async function run_shell_command(command:string) {
  let result; 
  try {
    result = await execProm(command.replace(/\n/g, "\\\n"));
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
     if(subdomain_info.value){
       await run_shell_command(`crontab -l | grep -n "\\[ ${subdomain_info.subdomain} ]" | cut -f1 -d:`).then( output => {
        let line_number = output.stdout  
        if(line_number) {      
          line_number++ 
           run_shell_command(`crontab -l | grep -q 'rsync -a ~/dynamic-soft-school/ /var/www/apps/${subdomain_info.subdomain}' && echo 'cronjob already exist!' || crontab -l | awk 'NR==`+line_number+`{print "* * * * * rsync -a ~/dynamic-soft-school/ /var/www/apps/${subdomain_info.subdomain}/"}1' | crontab -`)
        }
      });      
     }
     else{       
       await run_shell_command(`crontab -l | grep -v 'rsync -a ~/dynamic-soft-school/ /var/www/apps/${subdomain_info.subdomain}/' | crontab -`);
       await run_shell_command(`crontab -l | cat -s | crontab -`);
     }
     res.status(200).json('success');
}
