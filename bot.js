// Created By Eduardo Escoto. This software is open source and useable by anybody wanting to make a bot.
// Please Credit me when used.
// Ask me any questions about this code at @e_esc_ on twitter or at @eduardoescoto on github =)

let twit = require('twit');
let apiData = require('./apiKeys.js');
let Twitter = new twit(apiData);
let lastColor;

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
    const status =
        `💖💖💖💖💖💖💖💖💖💖💖💖💖💖
🌸 NAME: ${color.nameData.closestMatchName} 🌸
🌸 HEX: ${color.hex.combined} 🌸
🌸 RGB: (${color.rgb.red}, ${color.rgb.green}, ${color.rgb.blue}) 🌸
🌸 HSL: (${color.hsl.hueData.string}, ${color.hsl.saturationData.string}, ${color.hsl.lightnessData.string}) 🌸
💖💖💖💖💖💖💖💖💖💖💖💖💖💖`;
    return {
        media_ids,
        status
    }
}

function saveColor(color) {
    let fs = require('fs');
    let Jimp = require('jimp');
    let image = new Jimp(1080, 1920, color.hex.raw);
    image.quality(100);
    image.write('image.png', () => {
        console.log(`Saved image for color ${color.hex.combined}`);
        tweetImage(color)
    });
}

function generatePastelTweet() {
    const pastelGenerator = require('./pastelGenerator.js');
    const color = pastelGenerator.generateTweetColor();
    if (compareColorByHue(lastColor, color)) {
        saveColor(color);
        lastColor = color;
    } else {
        console.log(`Colors too similar colors were: ${lastColor.hex.combined} and ${color.hex.combined}`);
        generatePastelTweet();
    }
}

function compareColorByHue(lastColor, nextColor) {
    if (lastColor) {
        const lastHuePercentage = Number((lastColor.hsl.hueData.value / 360).toFixed(5));
        const nextHuePercentage = Number((nextColor.hsl.hueData.value / 360).toFixed(5));
        const difference = Math.abs(lastHuePercentage - nextHuePercentage) * 100;
        if (difference < 15) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
generatePastelTweet();
console.log(`Starting the cycle.`)
setInterval(() => {
    console.log("Running next cycle...");
    generatePastelTweet();
}, 1000*60*60*6);