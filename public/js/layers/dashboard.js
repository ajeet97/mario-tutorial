import Text from '../Text.js'

export default function createDashboardLayer(playerEnv) {
	const LINE1 = Text.size
	const LINE2 = 2 * Text.size

	const score = 12300
	const coins = 2

	return function drawDashboardLayer(context) {
		Text.print('MARIO', context, 16, LINE1)
		Text.print(score.toString().padStart(6, '0'), context, 16, LINE2)

		Text.print('@x' + coins.toString().padStart(2, '0'), context, 96, LINE2)

		Text.print('WORLD', context, 152, LINE1)
		Text.print('1-1', context, 160, LINE2)

		Text.print('TIME', context, 208, LINE1)
		const time = playerEnv.playerController.time.toFixed().padStart(3, '0')
		Text.print(time, context, 216, LINE2)
	}
}