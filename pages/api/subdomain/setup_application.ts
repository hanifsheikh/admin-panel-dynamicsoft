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
      await run_shell_command(`
      subdomain=${subdomain_info.prefix}
      maindomain='dynamicsoft.tech'
      fulldomain=$subdomain'.'$maindomain
      databasename='dynamicsoft_'$subdomain 
      cd /var/www/apps/$fulldomain/ &&
      cp .env.example .env &&                
      sed -i 's/database_name/'$databasename'/g' .env &&
      sed -i 's/database_username/qEKoIAWSvcmpMaOf/g' .env &&          
      sed -i 's/database_password/4RWOD\\/cv7XCF:7l:PBcvtFVk\\//g' .env &&    
      sed -i 's/APP_URL=http:\\/\\/localhost/APP_URL=https:\\/\\/${subdomain_info.prefix}.dynamicsoft.tech/g' .env &&
      php artisan storage:link && chmod -R 777 public/ && chmod -R 775 storage/ && chgrp -R www-data storage bootstrap/cache && cd /var/www/apps/$fulldomain/ && php artisan migrate --seed &&
      sed -i 's/APP_ENV=local/APP_ENV=production/g' .env &&
      sed -i 's/APP_DEBUG=true/APP_DEBUG=false/g' .env`).then(() => {
        res.status(200).send({message:'Application setup done!'});
       });  
        
     await run_shell_command(`systemctl restart nginx.service`);
     }
     else{       
          res.status(300).send({ error: 'Subdomain prefix is required.' });
     }
}
