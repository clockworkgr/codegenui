import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { queryClient, txClient } from './module'
import { RootState } from '../../../../index'
import { OfflineSigner } from '@cosmjs/proto-signing'
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
export interface IResponse {
	[key: string]: any
}
export interface IKeyParams {
	[key: string]: any
}
export interface ISubscription {
	action: string
	payload: IKeyParams
}
export interface IQuery {
	query: keyof Omit<ModuleState, '_Subscriptions'>
	key: string
	value: IResponse
}
export type ModuleState = {
	Balance: IResponse
	AllBalances: IResponse
	TotalSupply: IResponse
	SupplyOf: IResponse
	Params: IResponse
	DenomsMetadata: IResponse
	DenomMetadata: IResponse
	_Subscriptions: Set<ISubscription>
}
const getDefaultState = () => {
	return {
		Balance: {},
		AllBalances: {},
		TotalSupply: {},
		SupplyOf: {},
		Params: {},
		DenomsMetadata: {},
		DenomMetadata: {},
		_Subscriptions: new Set()
	}
}

// initial state
const state = getDefaultState()

export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state: ModuleState) {
			Object.assign(state, getDefaultState())
		},
		QUERY(state: ModuleState, { query, key, value }: IQuery) {
			state[query][JSON.stringify(key)] = value
		},
		SUBSCRIBE(state: ModuleState, subscription: ISubscription) {
			state._Subscriptions.add(subscription)
		},
		UNSUBSCRIBE(state: ModuleState, subscription: ISubscription) {
			state._Subscriptions.delete(subscription)
		}
	} as MutationTree<ModuleState>,
	getters: {
		getAllBalances: (state: ModuleState) => (params = {}) => {
			return state.AllBalances[JSON.stringify(params)] ?? {}
		},
		getBalance: (state: ModuleState) => (params = {}) => {
			return state.Balance[JSON.stringify(params)] ?? {}
		},
		getTotalSupply: (state: ModuleState) => (params = {}) => {
			return state.TotalSupply[JSON.stringify(params)] ?? {}
		},
		getSupplyOf: (state: ModuleState) => (params = {}) => {
			return state.SupplyOf[JSON.stringify(params)] ?? {}
		},
		getParams: (state: ModuleState) => (params = {}) => {
			return state.Params[JSON.stringify(params)] ?? {}
		},
		getDenomsMetadata: (state: ModuleState) => (params = {}) => {
			return state.DenomsMetadata[JSON.stringify(params)] ?? {}
		},
		getDenomMetadata: (state: ModuleState) => (params = {}) => {
			return state.DenomMetadata[JSON.stringify(params)] ?? {}
		}
	} as GetterTree<ModuleState, RootState>,
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
		async QueryBalance({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryBalance(key.address, key.denom)).data
				commit('QUERY', { query: 'Balance', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryBalance', payload: key })
			} catch (e) {
				console.log('Query Failed: API node unavailable')
			}
		},
		async QueryAllBalances({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryAllBalances(key.address)).data
				commit('QUERY', { query: 'AllBalances', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAllBalances', payload: key })
			} catch (e) {
				console.log('Query Failed: API node unavailable')
			}
		},
		async QueryTotalSupply({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryTotalSupply()).data
				commit('QUERY', { query: 'TotalSupply', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'queryTotalSupply', payload: key })
			} catch (e) {
				console.log('Query Failed: API node unavailable')
			}
		},
		async QuerySupplyOf({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).querySupplyOf(key.denom)).data
				commit('QUERY', { query: 'SupplyOf', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QuerySupplyOf', payload: key })
			} catch (e) {
				console.log('Query Failed: API node unavailable')
			}
		},
		async QueryParams({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryParams()).data
				commit('QUERY', { query: 'Params', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: key })
			} catch (e) {
				console.log('Query Failed: API node unavailable')
			}
		},
		async QueryDenomsMetadata({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryDenomsMetadata()).data
				commit('QUERY', { query: 'DenomsMetadata', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDenomsMetadata', payload: key })
			} catch (e) {
				console.log('Query Failed: API node unavailable')
			}
		},
		async QueryDenomMetadata({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryDenomMetadata(key.denom)).data
				commit('QUERY', { query: 'DenomMetadata', key, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDenomMetadata', payload: key })
			} catch (e) {
				console.log('Query Failed: API node unavailable')
			}
		},
		async MsgSend({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgSend(value)
				await (await initTxClient(rootGetters)).signAndBroadcast([msg])
			} catch (e) {
				throw 'Failed to broadcast transaction'
			}
		},
		async MsgMultiSend({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgMultiSend(value)
				await (await initTxClient(rootGetters)).signAndBroadcast([msg])
			} catch (e) {
				throw 'Failed to broadcast transaction'
			}
		}
	} as ActionTree<ModuleState, RootState>
}
