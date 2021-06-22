export function loadJSON(url) {
	return fetch(url).then(r => r.json())
}

export function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image()
		image.addEventListener('load', () => {
			resolve(image)
		})
		image.src = url
	})
}

export async function loadAudio(url, audioContext) {
	const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
	const audioBuffer = audioContext.decodeAudioData(arrayBuffer)
	return audioBuffer
}