// curl -X POST https://api.github.com/repos/ctocto/webpack4-MPA/dispatches \
//     -H "Accept: application/vnd.github.everest-preview+json" \
//     -H "Authorization: token e36d6144ebf1049f45da1c77e91aeb7868254820" \
//     --data '{"event_type": "webhook_publish"}'
const https = require('https');
const inquirer = require('inquirer');


inquirer
  .prompt([
    {
      type: 'list',
      name: 'user',
      message: 'Please select GitHub user name',
      choices: ['ctocto'],
      // filter: function(val) {
      //   return val.toLowerCase();
      // }
    }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
    post(answers.user);
  });

function post(user) {
  const data = JSON.stringify({
    "event_type": "webhook_publish"
  });
  const host = 'api.github.com'; // api.github.com
  const path = `/repos/${user}/webpack4-MPA/dispatches`; // /repos/ctocto/webpack4-MPA/dispatches
  
  const opt = {
    hostname: host,  
    method: 'POST',  
    path: path,  
    headers: {  
      'User-Agent': 'request', // https://stackoverflow.com/questions/39907742/github-api-is-responding-with-a-403-when-using-requests-request-function/39912696
      'Accept': 'application/vnd.github.everest-preview+json',  
      'Authorization': 'token e36d6144ebf1049f45da1c77e91aeb7868254820',
      'Content-Type' : 'application/json',
      'Content-Length' : Buffer.byteLength(data, 'utf8')
    } 
  };
  const req = https.request(opt, function(res){
    console.log('STATUS:'+res.statusCode);
    // console.log('HEADERS:'+JSON.stringify(res.headers));
    // res.setEncoding('utf8');
    if (res.statusCode === 204 || res.statusCode === 200) {
      console.log('\x1B[32m%s\x1B[0m', '\nsuccessfully\n')
    }
    res.on('data', function(d) {
      console.info('POST result:\n');
      process.stdout.write(d);
      console.info('\n\nPOST completed');
    });
  });
  
  req.on('error', (e) => {
    console.log('\x1B[31m%s\x1B[0m', e.message);
    console.error( e);
  });
  
  req.write(data);
  req.end();
}