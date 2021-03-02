
import module from './cosmos.bank.v1beta1.js'
const package = 'cosmos/cosmos-sdk/cosmos.bank.v1beta1';
const path = [ 'chain', ...package.split('/')]

export default function init(store) {
	for (let i=1; i<path.length;i++) {
		let ns= path.slice(0,i)
		if (!store.hasModule(ns)) {
			store.registerModule(ns, { namespaced: true })
		}
	}
	store.registerModule(
		path,
		module
	)
	store.subscribe((mutation) => {
		if (mutation.type == 'chain/common/env/INITIALIZE_WS_COMPLETE') {
			store.dispatch(
				package+'/init',
				null,
				{
					root: true
				}
			)
		}
	})
}
