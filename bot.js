let twit = require('twit');
let apiData = require('./apiKeys.js');
let Twitter = new twit(apiData);

function postTweet(tweet) {
    let path = 'statuses/update';
    Twitter.post(path, tweet, (err, data, response) => console.log(data));
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
        console.log('Image uploaded!');
        media_ids = new Array(data.media_id_string);
        console.log(media_ids)
        const tweetData = generateTweetData(color, media_ids);
        postTweet(tweetData);
    });

}

function generateTweetData(color, media_ids) {
    const status = "HEX: " + color.hex.combined + "\r\n" +
        "RGB: (" + color.rgb.red + ", " + color.rgb.green + ", " + color.rgb.blue + ")\r\n" +
        "HSL: (" + color.hsl.hue + ", " + color.hsl.saturation + ", " + color.hsl.lightness + ")\r\n";
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
    generatePastelTweet()
}, 1000 * 60 * 60 * 6)