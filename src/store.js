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
	mutualFollowings: [],
	userOneFollowings: [],
	userTwoFollowings: [],
	errorMessageFieldOne: '',
	errorMessageFieldTwo: '',
	flagOneStarsFetchFinished: false,
  	flagTwoStarsFetchFinished: false
}

const getters = {
	mutualStarred: state => state.mutualStarred,
	userOneStarred: state => state.userOneStarred,
	userTwoStarred: state => state.userTwoStarred,
	mutualFollowers: state => state.mutualFollowers,
	userOneFollowers: state => state.userOneFollowers,
	userTwoFollowers: state => state.userTwoFollowers,
	mutualFollowings: state => state.mutualFollowings,
	userOneFollowings: state => state.userOneFollowings,
	userTwoFollowings: state => state.userTwoFollowings,
	errorMessageFieldOne: state => state.errorMessageFieldOne,
	errorMessageFieldTwo: state => state.errorMessageFieldTwo,
	flagOneStarsFetchFinished: state => state.flagOneStarsFetchFinished,
	flagTwoStarsFetchFinished: state => state.flagTwoStarsFetchFinished
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
	},
	mutateFollowingsInfo (state, obj) {
		state.mutualFollowings = obj.data.mutualFollowings
		state.userOneFollowings = obj.data.userOneFollowings
		state.userTwoFollowings = obj.data.userTwoFollowings
	}
}

const actions = {
	getStarsInfo ({ commit, state }, data) {
		commit("mutateStarsInfo", { data })
	},
	getFollowersInfo ({ commit, state }, data) {
		commit("mutateFollowersInfo", { data })
	},
	getFollowingsInfo ({ commit, state }, data) {
		commit("mutateFollowingsInfo", { data })
	}
}

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})