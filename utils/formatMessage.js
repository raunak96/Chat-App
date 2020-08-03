const moment = require('moment');

const formatMessage=(username,text)=>({
    text,
    username,
    time: moment().format('h:mm a')
});

module.exports=formatMessage;