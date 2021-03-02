import mod from './cosmos.bank.v1beta1.js'
const modpath = 'cosmos/cosmos-sdk/cosmos.bank.v1beta1'
const fullns = ['chain', ...modpath.split('/')]

export default function init(store) {
	for (let i = 1; i < fullns.length; i++) {
		let ns = fullns.slice(0, i)
		if (!store.hasModule(ns)) {
			store.registerModule(ns, { namespaced: true })
		}
	}
	store.registerModule(fullns, mod)
	store.subscribe((mutation) => {
		if (mutation.type == 'chain/common/env/INITIALIZE_WS_COMPLETE') {
			store.dispatch(fullns.join('/') + '/init', null, {
				root: true
			})
		}
	})
}
