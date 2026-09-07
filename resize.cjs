const { Jimp } = require('jimp');
async function f() {
    try {
        const img = await Jimp.read('public/inove-logo.png');
        img.contain({ w: 800, h: 420 });
        await img.write('public/og-image.jpg');
        console.log('OK');
    } catch(e) { console.error('Error:', e.message); }
}
f();
