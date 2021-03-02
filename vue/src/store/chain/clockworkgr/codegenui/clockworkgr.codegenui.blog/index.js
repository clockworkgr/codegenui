import mod from './clockworkgr.codegenui.blog.js'
const modpath = 'clockworkgr/codegenui/clockworkgr.codegenui.blog'
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
