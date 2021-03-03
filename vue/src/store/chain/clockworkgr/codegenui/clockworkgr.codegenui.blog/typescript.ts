import { txClient, queryClient } from "./module";
import {MutationTree,ActionTree} from "vuex";

async function initTxClient(vuexGetters):Promise<any> {
	return await txClient(vuexGetters["chain/common/wallet/signer"], {
		addr: vuexGetters["chain/common/env/apiTendermint"]
	});
}

async function initQueryClient(vuexGetters):Promise<any> {
	return await queryClient({
		addr: vuexGetters["chain/common/env/apiCosmos"]
	});
}
const getDefaultState = () => {
	return {
		_Structure: {
			Post: {
				fields: [
					{
						name: "creator",
						type: "string"
					},
					{
						name: "id",
						type: "string"
					},
					{
						name: "title",
						type: "string"
					},
					{
						name: "body",
						type: "string"
					},
					{
						name: "votes",
						type: "int"
					}
				]
			}
		},
		Post: {},
		PostAll: {},
		_Subscriptions: new Set()
	};
};
// initial state
const state = getDefaultState();
export interface IQuery {
	query: string;
	key: string;
	value: any;
}
export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state):void {
			Object.assign(state, getDefaultState());
		},
		QUERY(state, { query, key, value }:IQuery):void {
			state[query][JSON.stringify(key)] = value;
		},
		SUBSCRIBE(state, subscription:Map<string,any>):void {
			state._Subscriptions.add(subscription);
		},
		UNSUBSCRIBE(state, subscription:Map<string,any>):void {
			state._Subscriptions.delete(subscription);
		}
	},
	getters: {
		getPost: (state) => (params = {}) => {
			return state.Post[JSON.stringify(params)] ?? {};
		},
		getPostAll: (state) => (params = {}) => {
			return state.PostAll[JSON.stringify(params)] ?? {};
		},
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields;
		}
	},
	actions: {
		init({ dispatch, rootGetters }):void {
			console.log("init");
			if (rootGetters["chain/common/env/client"]) {
				rootGetters["chain/common/env/client"].on("newblock", () => {
					dispatch("StoreUpdate");
				});
			}
		},
		resetState({ commit }):void {
			commit("RESET_STATE");
		},
		async StoreUpdate({ state, dispatch }):Promise<void> {
			state._Subscriptions.forEach((subscription) => {
				dispatch(subscription.action, subscription.payload);
			});
		},
		unsubscribe({ commit }, subscription):Promise<void> {
			commit("UNSUBSCRIBE", subscription);
		},
		async QueryPost({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryPost(key.id)).data;
				commit("QUERY", { query: "Post", key, value });
				if (subscribe) { commit("SUBSCRIBE", { action: "QueryPost", payload: key }); }
			} catch (e) {
				console.log("Query Failed: API node unavailable");
			}
		},
		async QueryPostAll({ commit, rootGetters }, { subscribe = false, ...key }) {
			try {
				const value = (await (await initQueryClient(rootGetters)).queryPostAll()).data;
				commit("QUERY", { query: "PostAll", key, value });
				if (subscribe) { commit("SUBSCRIBE", { action: "QueryPostAll", payload: key }); }
			} catch (e) {
				console.log("Query Failed: API node unavailable");
			}
		},
		async MsgCreatePost({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgCreatePost(value);
				await (await initTxClient(rootGetters)).signAndBroadcast([msg]);
			} catch (e) {
				throw "Failed to broadcast transaction: " + e;
			}
		},
		async MsgUpdatePost({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgUpdatePost(value);
				await (await initTxClient(rootGetters)).signAndBroadcast([msg]);
			} catch (e) {
				throw "Failed to broadcast transaction: " + e;
			}
		},
		async MsgDeletePost({ rootGetters }, { value }) {
			try {
				const msg = await (await initTxClient(rootGetters)).msgDeletePost(value);
				await (await initTxClient(rootGetters)).signAndBroadcast([msg]);
			} catch (e) {
				throw "Failed to broadcast transaction: " + e;
			}
		}
	}
};
