import { loadJSON, loadAudio } from './loaders.js'

export default class AudioBoard {
	/** @type {AudioContext} */
	static context = null
	static buffers = new Map()

	constructor() {
		this.buffers = new Map()
	}

	static setAudioContext(context) {
		this.context = context
	}

	static async load(name) {
		const audioSpec = await loadJSON(`./sounds/${name}.json`)
		const fx = audioSpec.fx
		const audio = new AudioBoard()
		await Promise.all(Object.keys(fx).map(async (name) => {
			const buffer = await loadAudio(fx[name].url, AudioBoard.context)
			audio.define(name, buffer)
		}))
		return audio
	}

	define(name, buffer) {
		this.buffers.set(name, buffer)
	}

	play(name) {
		const buffer = this.buffers.get(name)
		if (!buffer) return

		const source = AudioBoard.context.createBufferSource()
		source.connect(AudioBoard.context.destination)
		source.buffer = buffer
		source.start(0)
	}
}
