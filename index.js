const axios = require('axios');
const schedule = require('node-schedule');
const Instagram = require('instagram-web-api');
let state = 310235;
require('dotenv').config();
const client = new Instagram({ username: process.env.username, password: process.env.password });

schedule.scheduleJob('*/10 * * * *', function await () {
  scrape();
})

async function scrape(){
  let content = await axios.get('https://archillect.com/' + state).then(res => res.data);
  let match = content.match(/twitter:image.*?content="(.*)"/)[1];
  let caption = (new Date().getHours() > 13 ? new Date().getHours() - 12 : (new Date().getHours()) < 10 ? '0' + new Date().getHours() : false) + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()) + ' ' + (new Date().getHours() < 13 ? 'AM' : 'PM')
  match.endsWith('.jpg') || match.endsWith('.jpeg') ? postImage(match, caption) : false
  state++;
}

function postImage(photo, caption) {
  client.login()
    .then(async () => {
      await client.uploadPhoto({ photo, caption: caption, post: 'feed' });
    })
    .catch(async () => {
      await client.uploadPhoto({ photo, caption: caption, post: 'story' });
    })
}