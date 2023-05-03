// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const util = require("util");
const exec = require('child_process').exec;
const execProm = util.promisify(exec);
const subdomain_config_list_path = '/etc/nginx/sites-enabled/';
const fs = require('fs')

let php_version= ""; 
let node_version= ""; 
let storage_info= ""; 
let memory_info= ""; 
let total_memory= 0; 
let storage_percentage= ""; 
let subdomains_count= 0; 
let subdomains=  [{subdomain:'' , automatic_update:false}] ; 

type Subdomain = {
  subdomain:string,
  automatic_update:boolean,
}
type Data = {
  php_version: string,
  node_version: string,
  storage_info: string,
  ram_info: string,
  storage_percentage: string,
  subdomains_count: number,
  subdomains:Subdomain[]
}

    
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
    await run_shell_command('php -r "echo phpversion();"').then( output => {
      php_version = output.stdout
    });
    await run_shell_command('node -v').then( output => {
      node_version = output.stdout.substring(1)
    });  
    await run_shell_command('grep MemTotal /proc/meminfo').then( output => {      
      let memtotal =  output.stdout.split(" ").filter(function(item:string, pos:number) {
        return output.stdout.split(" ").indexOf(item) == pos;
    })
    total_memory = (parseFloat(memtotal[2])/(1024*1024));     
    });  
    await run_shell_command('grep MemAvailable /proc/meminfo').then( output => {      
      let memfree =  output.stdout.split(" ").filter(function(item:string, pos:number) {
        return output.stdout.split(" ").indexOf(item) == pos;
    })
    memfree = (parseFloat(memfree[2])/(1024*1024));     
    memory_info = (total_memory - parseFloat(memfree)).toFixed(2) + 'G ('+ ((total_memory - parseFloat(memfree))*100 / total_memory).toFixed() +'%) of ' + total_memory.toFixed(2) + 'G';
    
    });     
   
    await run_shell_command("df -h --total | grep total").then( output => {
      let filtered_text_array = output.stdout.replace('total', '').split(" ").filter((e :string)  => e !== '' && e !== '-\n')
      let storage_used = String(parseFloat(filtered_text_array[1].replace('K', '').replace('M', '').replace('G', '')).toFixed(1)) + (filtered_text_array[1].includes('K') ? ' KB' : (filtered_text_array[1].includes('M') ? ' MB' : ' GB') );
      let storage_capacity = String(parseFloat(filtered_text_array[0].replace('K', '').replace('M', '').replace('G', '')).toFixed(1)) + (filtered_text_array[0].includes('K') ? ' KB' : (filtered_text_array[0].includes('M') ? ' MB' : ' GB') );
      storage_info =  storage_used + ' / ' + storage_capacity;
      storage_percentage =  filtered_text_array[3];
    });

   await fs.readdir(subdomain_config_list_path, async (err:string, files: []) => {
    subdomains = [];
    files.forEach( async (file :string) => {
      if(file.includes('dynamicsoft.tech')) { 
        if(!(file.toLowerCase().includes('databases') || file.toLowerCase().includes('admin') ||  file.toLowerCase() === "dynamicsoft.tech")){
              await run_shell_command(`crontab -l | grep -q 'rsync -a ~/dynamic-soft-school/ /var/www/apps/${file}' && echo true || echo false `).then(output => {
                let automatic_update_status = output.stdout.toString();           
                 subdomains.push({subdomain: file, automatic_update: Boolean(automatic_update_status.trim() === 'true') });
                 subdomains_count = subdomains.length;
           })                  
        }     
      }
    });
  });
 
    res.status(200).json({ php_version, node_version, storage_info, memory_info, storage_percentage, subdomains_count, subdomains })
}
