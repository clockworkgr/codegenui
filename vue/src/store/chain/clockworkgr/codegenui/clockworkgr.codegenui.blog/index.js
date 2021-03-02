
import module from './clockworkgr.codegenui.blog.js'
const package = 'clockworkgr/codegenui/clockworkgr.codegenui.blog';
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
