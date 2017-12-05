module.exports = {
    generateTweetColor: function () {
        let color = createColor();
        if (doesColorExist(color)) {
            generateTweetImage();
        } else {
            addColorToData(color);
            return color;
        }
    }
}

function saveColor(color) {
    let Jimp = require('jimp');
    let image = new Jimp(1200, 900, color.hex.raw);
    image.quality(100);
    image.write('image.png', () => {
        console.log('complete! Created color: ', color);
    });
}

function addColorToData(color) {
    let fs = require('fs');
    fs.readFile('./pastelsCreated.json', (err, data) => {
        let jsonData = JSON.parse(data);
        jsonData
            .existingColors
            .push(color.hex.raw);
        fs.writeFile('./pastelsCreated.json', JSON.stringify(jsonData));
    })
}

function doesColorExist(color) {
    let fs = require('fs');
    fs.readFile('./pastelsCreated.json', (err, data) => {
        const jsonData = JSON.parse(data);
        const pastelscreated = jsonData.existingColors;
        pastelscreated.forEach(value => {
            if (color.hex.raw === value) {
                return true;
            }
        })
    })
    return false;
}

function getRandomLightnessInRange(min, max) {
    let lightness = Math.random();
    while (lightness < min || lightness > max) {
        console.log("lightness out of range, retrying...", lightness);
        lightness = Math.random();
    }
    return lightness.toFixed(2);
}

function getRandomSaturationInRange(min, max = 1) {
    let saturation = Math.random();
    while (saturation < min || saturation > max) {
        console.log("saturation out of range, retrying...", saturation);
        saturation = Math.random();
    }
    return saturation.toFixed(2)
}

function createColor() {
    const pastelRange = {
        min: .775,
        max: .925,
        satMin: .85,
        satMax: 1
    }
    const hue = Math.floor(Math.random() * 360);
    const hueData = {
        string: hue.toString(),
        value: hue
    }
    const saturation = getRandomSaturationInRange(pastelRange.satMin, pastelRange.satMax);
    const saturationData = {
        string: (saturation * 100).toString() + "%",
        value: parseInt(saturation * 100) / 100
    }
    const lightness = getRandomLightnessInRange(pastelRange.min, pastelRange.max);
    const lightnessData = {
        string: ((lightness * 100).toString() + "%"),
        value: parseInt(lightness * 100) / 100
    }
    const rgb = hslToRgb(hueData.value, saturationData.value, lightnessData.value);

    const hex = {
        red: toHex(rgb.red),
        blue: toHex(rgb.blue),
        green: toHex(rgb.green),
        alpha: "FF",
        combined: ("#" + toHex(rgb.red) + toHex(rgb.green) + toHex(rgb.blue)).toUpperCase(),
        raw: parseInt("0x" + toHex(rgb.red) + toHex(rgb.green) + toHex(rgb.blue) + "FF", 16)
    }
    const hsl = {
        hueData,
        saturationData,
        lightnessData
    };
    let color = {
        hsl,
        rgb,
        hex
    }
    return color;
}

function hslToRgb(hue, sat, light) {
    let t1,
        t2,
        red,
        green,
        blue;
    hue = hue / 60;
    if (light <= 0.5) {
        t2 = light * (sat + 1);
    } else {
        t2 = light + sat - (light * sat);
    }
    t1 = light * 2 - t2;
    red = Math.floor(hueToRgb(t1, t2, hue + 2) * 255);
    green = Math.floor(hueToRgb(t1, t2, hue) * 255);
    blue = Math.floor(hueToRgb(t1, t2, hue - 2) * 255);
    return {
        red,
        green,
        blue
    };
}

function toHex(n) {
    var hex = n.toString(16);
    while (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function hueToRgb(t1, t2, hue) {
    if (hue < 0) {
        hue += 6;
    }
    if (hue >= 6) {
        hue -= 6;
    }
    if (hue < 1) {
        return (t2 - t1) * hue + t1;
    } else if (hue < 3) {
        return t2;
    } else if (hue < 4) {
        return (t2 - t1) * (4 - hue) + t1;
    } else {
        return t1;
    }
}