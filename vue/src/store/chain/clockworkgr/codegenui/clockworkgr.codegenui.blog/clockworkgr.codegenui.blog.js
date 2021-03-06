import { txClient, queryClient } from './module'
import { SpVuexError } from '@starport/vuex'

import { Post } from './module/types/blog/post'

function getStructure(template) {
	let structure = { fields: [] }
	for (const [key, value] of Object.entries(template)) {
		let field = {}
		field.name = key
		field.type = typeof value
		structure.fields.push(field)
	}
	return structure
}
const postStructure = getStructure(Post.fromPartial({}))

async function initTxClient(vuexGetters) {
	return await txClient(vuexGetters['chain/common/wallet/signer'], {
		addr: vuexGetters['chain/common/env/apiTendermint']
	})
}

async function initQueryClient(vuexGetters) {
	return await queryClient({
		addr: vuexGetters['chain/common/env/apiCosmos']
	})
}
const getDefaultState = () => {
	return {
		_Structure: {
			Post: postStructure
		},
		Post: {},
		PostAll: {},
		_Subscriptions: new Set()
	}
}
// initial state
const state = getDefaultState()

export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state) {
			Object.assign(state, getDefaultState())
		},
		QUERY(state, { query, key, value }) {
			state[query][JSON.stringify(key)] = value
		},
		SUBSCRIBE(state, subscription) {
			state._Subscriptions.add(subscription)
		},
		UNSUBSCRIBE(state, subscription) {
			state._Subscriptions.delete(subscription)
		}
	},
	getters: {
		getPost: (state) => (params = {}) => {
			return state.Post[JSON.stringify(params)] ?? {}
		},
		getPostAll: (state) => (params = {}) => {
			return state.PostAll[JSON.stringify(params)] ?? {}
		},
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields
		}
	},
	actions: {
		init({ dispatch, rootGetters }) {
			if (rootGetters['chain/common/env/client']) {
				rootGetters['chain/common/env/client'].on('newblock', () => {
					dispatch('StoreUpdate')
				})
			}
		},
		resetState({ commit }) {
			commit('RESET_STATE')
		},
		async StoreUpdate({ state, dispatch }) {
			state._Subscriptions.forEach((subscription) => {
				dispatch(subscription.action, subscription.payload)
			})
		},
		unsubscribe({ commit }, subscription) {
			commit('UNSUBSCRIBE', subscription)
		},
		async QueryPost({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryPost(key.id)).data
				commit('QUERY', { query: 'Post', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPost', payload: key })
			} catch (e) {
				console.error(new SpVuexError('QueryClient:QueryPost', 'API Node Unavailable. Could not perform query.'))
			}
		},
		async QueryPostAll({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryPostAll()).data
				commit('QUERY', { query: 'PostAll', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPostAll', payload: key })
			} catch (e) {
				console.error(new SpVuexError('QueryClient:QueryPostAll', 'API Node Unavailable. Could not perform query.'))
			}
		},
		async MsgCreatePost({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgCreatePost(value)
				await (await initTxClient(rootGetters)).signAndBroadcast([msg])
			} catch (e) {
				throw 'Failed to broadcast transaction: ' + e
			}
		},
		async MsgUpdatePost({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgUpdatePost(value)
				await (await initTxClient(rootGetters)).signAndBroadcast([msg])
			} catch (e) {
				throw 'Failed to broadcast transaction: ' + e
			}
		},
		async MsgDeletePost({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgDeletePost(value)
				await (await initTxClient(rootGetters)).signAndBroadcast([msg])
			} catch (e) {
				throw 'Failed to broadcast transaction: ' + e
			}
		}
	}
}
