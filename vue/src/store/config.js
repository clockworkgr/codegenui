import { env, starport, blocks, wallet } from '@starport/vuex'
import bank from './chain/cosmos/cosmos-sdk/cosmos.bank.v1beta1'
import blog from './chain/clockworkgr/codegenui/clockworkgr.codegenui.blog'

export default function init(store) {
	store.registerModule(['chain'], { namespaced: true })
	bank(store)
	starport(store)
	blocks(store)
	blog(store)
	env(store)
	wallet(store)
}
