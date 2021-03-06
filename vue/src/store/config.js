import { env, starport, blocks, wallet } from '@starport/vuex'
import generated from './chain'
export default function init(store) {
	for (const moduleInit of Object.values(generated)) {
		moduleInit(store)
	}
	starport(store)
	blocks(store)
	env(store)
	wallet(store)
}
