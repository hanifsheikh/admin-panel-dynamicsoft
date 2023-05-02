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
           res.status(200).json('subdomain exist')
          }  
        });     
        await run_shell_command(`      
        subdomain=${subdomain_info.prefix}
        maindomain='dynamicsoft.tech'
        fulldomain=$subdomain'.'$maindomain
        databasename='dynamicsoft_'$subdomain 
        mkdir -p /var/www/apps/$fulldomain &&
        cp /etc/nginx/sites-available/subdomain-config /etc/nginx/sites-available/$fulldomain &&
        sed -i 's/subdomain/'$subdomain'/g' /etc/nginx/sites-available/$fulldomain &&
        ln -s /etc/nginx/sites-available/$fulldomain /etc/nginx/sites-enabled/$fulldomain &&
        systemctl restart nginx.service &&
        mysql -e 'CREATE DATABASE '$databasename && 
        crontab -l > cronjobs && 
        echo "\n### --------------------- [ $fulldomain ] ---------------------###" >> cronjobs &&
        echo "@reboot sleep 60 && php /var/www/apps/$fulldomain/artisan schedule:run" >> cronjobs && 
        tr -d "\r" <cronjobs > cronjobs_unix && crontab cronjobs_unix &&
        cd ~/dynamic-soft-school/ && git pull && 
        rsync -a ~/dynamic-soft-school/ /var/www/apps/$fulldomain/ &&
        cd /var/www/apps/$fulldomain/ &&
        cp .env.example .env &&                
        sed -i 's/database_name/'$databasename'/g' .env &&
        sed -i 's/database_username/qEKoIAWSvcmpMaOf/g' .env &&          
        sed -i 's/database_password/4RWOD\\/cv7XCF:7l:PBcvtFVk\\//g' .env &&    
        sed -i 's/APP_URL=http:\\/\\/localhost/APP_URL=https:\\/\\/${subdomain_info.prefix}.dynamicsoft.tech/g' .env &&
        php artisan storage:link && chmod -R 777 public/ && chmod -R 775 storage/ && chgrp -R www-data storage bootstrap/cache && cd /var/www/apps/$fulldomain/ && php artisan migrate --seed &&
        sed -i 's/APP_ENV=local/APP_ENV=production/g' .env &&
        sed -i 's/APP_DEBUG=true/APP_DEBUG=false/g' .env`).then((output) => {
          res.status(200).json({message: subdomain_info.prefix + '.dynamicsoft.tech' + ' has been created!', status:'success'});
      }) 
     }
     else{       
          res.status(200).json('subdomain prefix is required');
     }
}
