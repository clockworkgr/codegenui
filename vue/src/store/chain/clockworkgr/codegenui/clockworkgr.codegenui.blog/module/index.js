import { SigningStargateClient } from '@cosmjs/stargate'
import { Registry } from '@cosmjs/proto-signing'
import { Api } from './rest'
import { MsgCreatePost } from './types/blog/tx'
import { MsgDeletePost } from './types/blog/tx'
import { MsgUpdatePost } from './types/blog/tx'
const types = [
	['/clockworkgr.codegenui.blog.MsgCreatePost', MsgCreatePost],
	['/clockworkgr.codegenui.blog.MsgDeletePost', MsgDeletePost],
	['/clockworkgr.codegenui.blog.MsgUpdatePost', MsgUpdatePost]
]
const registry = new Registry(types)
const defaultFee = {
	amount: [],
	gas: '200000'
}
const txClient = async (wallet, { addr: addr } = { addr: 'http://localhost:26657' }) => {
	if (!wallet) throw new Error('wallet is required')
	const client = await SigningStargateClient.connectWithSigner(addr, wallet, { registry })
	const { address } = (await wallet.getAccounts())[0]
	return {
		signAndBroadcast: (msgs, { fee: fee } = { fee: defaultFee }) => client.signAndBroadcast(address, msgs, fee),
		msgCreatePost: (data) => ({ typeUrl: '/clockworkgr.codegenui.blog.MsgCreatePost', value: data }),
		msgDeletePost: (data) => ({ typeUrl: '/clockworkgr.codegenui.blog.MsgDeletePost', value: data }),
		msgUpdatePost: (data) => ({ typeUrl: '/clockworkgr.codegenui.blog.MsgUpdatePost', value: data })
	}
}
const queryClient = async ({ addr: addr } = { addr: 'http://localhost:1317' }) => {
	return new Api({ baseUrl: addr })
}
export { txClient, queryClient }
