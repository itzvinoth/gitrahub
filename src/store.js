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

const mutations = {}

const actions = {}

export default {
	state,
	getters,
	mutations,
	actions
}