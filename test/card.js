const fs = require('fs-extra');
const path = require('path');
const { createCanvas, Image } = require('canvas')
const gifcoder = require('gifencoder');
const sharp = require('sharp');
const request = require('request');

const img = {
	width: 223,
	height: 310
}

module.exports = async function(engine, msg) {

	const canvas = createCanvas(img.width, img.height)
	const ctx = canvas.getContext('2d')
	const encoder = new gifcoder(img.width, img.height)
	encoder.start();
	encoder.setRepeat(0);
	encoder.setDelay(40);

	const filePath = path.join(engine.config.brain, 'mtg', msg.ts + ".gif");
	const fileStream = fs.createWriteStream(filePath);
	let downloadCallback = null;
	const download = new Promise(res => downloadCallback = res);

	console.log("downloading...")
	request({
		uri: msg.files[0].url_private,
		headers: {
			Authorization: 'Bearer ' + engine.config.token
		}
	})
	.pipe(fileStream)
	.on('finish', _ => {
		downloadCallback()
		console.log("Download finished.")
	})

	await download
	console.log(filePath, fs.existsSync(filePath))

	for(let i = 50; i > 0; i--) {
		await sharp(path.join(__dirname, `karp/fish (${i}).png`))
			.resize(185, 135, {
				fit: 'inside'
			})
			.toBuffer()
			.then(buffer => {
				return sharp(filePath)
					.resize(223)
					.composite([{ input: buffer, top: 90, left: 25 }])
					.toBuffer()
					.then(composite => {
						const img = new Image();
						img.src = composite;
						ctx.drawImage(img, 0, 0);
						encoder.addFrame(ctx);
					})
			});
	}
	encoder.finish();
	await fs.writeFile(filePath, encoder.out.getData());

}
