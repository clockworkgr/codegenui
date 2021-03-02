import blog from './clockworkgr.codegenui.blog.js'

export default function init(store) {
	if (!store.hasModule(['chain', 'clockworkgr'])) {
		store.registerModule(['chain', 'clockworkgr'], { namespaced: true })
	}
	if (!store.hasModule(['chain', 'clockworkgr', 'codegenui'])) {
		store.registerModule(['chain', 'clockworkgr', 'codegenui'], {
			namespaced: true
		})
	}
	store.registerModule(
		['chain', 'clockworkgr', 'codegenui', 'clockworkgr.codegenui.blog'],
		blog
	)
	store.subscribe((mutation) => {
		if (mutation.type == 'chain/common/env/INITIALIZE_WS_COMPLETE') {
			store.dispatch(
				'chain/clockworkgr/codegenui/clockworkgr.codegenui.blog/init',
				null,
				{
					root: true
				}
			)
		}
	})
}
