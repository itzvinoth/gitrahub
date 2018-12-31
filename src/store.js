import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	mutualStarred: [],
	userOneStarred: [],
	userTwoStarred: [],
	mutualFollowers: [],
	userOneFollowers: [],
	userTwoFollowers: [],
	mutualFollowing: [],
	userOneFollowing: [],
	userTwoFollowing: []
}

const getters = {
	mutualStarred: state => state.mutualStarred,
	userOneStarred: state => state.userOneStarred,
	userTwoStarred: state => state.userTwoStarred,
	mutualFollowers: state => state.mutualFollowers,
	userOneFollowers: state => state.userOneFollowers,
	userTwoFollowers: state => state.userTwoFollowers,
	mutualFollowing: state => state.mutualFollowing,
	userOneFollowing: state => state.userOneFollowing,
	userTwoFollowing: state => state.userTwoFollowing
}

const mutations = {
	mutateStarsInfo (state, obj) {
		state.mutualStarred = obj.data.mutualStarred
		state.userOneStarred = obj.data.userOneStarred
		state.userTwoStarred = obj.data.userTwoStarred
	},
	mutateFollowersInfo (state, obj) {
		state.mutualFollowers = obj.data.mutualFollowers
		state.userOneFollowers = obj.data.userOneFollowers
		state.userTwoFollowers = obj.data.userTwoFollowers
	}
}

const actions = {
	getStarsInfo ({ commit, state }, data) {
		commit("mutateStarsInfo", { data })
	},
	getFollowersInfo ({ commit, state }, data) {
		console.log(data)
		commit("mutateFollowersInfo", { data })
	}
}

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})