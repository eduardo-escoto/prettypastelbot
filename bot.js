let twit = require('twit');
let apiData = require('./apiKeys.js');
let Twitter = new twit(apiData);

function postTweet(tweet) {
    let path = 'statuses/update';
    Twitter.post(path, tweet, (err, data, response) => console.log("Tweet Posted Successfuly"));
}

function tweetImage(color) {
    let fs = require('fs');
    const image_path = './image.png';
    let b64content = fs.readFileSync(image_path, {
        encoding: 'base64'
    });
    Twitter.post('media/upload', {
        media_data: b64content
    }, (err, data, response) => {
        media_ids = new Array(data.media_id_string);
        const tweetData = generateTweetData(color, media_ids);
        console.log("Tweeting the color: " + color.hex.combined);
        postTweet(tweetData);
    });
   
}

function generateTweetData(color, media_ids) {
    const status = "HEX: " + color.hex.combined + "\r\n" +
        "RGB: (" + color.rgb.red + ", " + color.rgb.green + ", " + color.rgb.blue + ")\r\n" +
        "HSL: (" + color.hsl.hue.string + ", " + color.hsl.saturation.string + ", " + color.hsl.lightness.string + ")\r\n";
    return {
        media_ids,
        status
    }
}
function saveColor(color) {
    let fs = require('fs');
    let Jimp = require('jimp');
    let image = new Jimp(1200, 900, color.hex.raw);
    image.quality(100);
    image.write('image.png', () => {console.log('complete'); tweetImage(color)});
}

function generatePastelTweet() {
    const pastelGenerator = require('./pastelGenerator.js');
    const color = pastelGenerator.generateTweetColor();
    saveColor(color);
}

generatePastelTweet();
setInterval(() => {
    generatePastelTweet();
    console.log("Running next cycle...");
}, 21600000)