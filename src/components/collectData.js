import axios from 'axios'
let countStarsOne = 1
let countStarsTwo = 1
let countFollowersOne = 1
let countFollowersTwo = 1
let userOneStarredRepos = []
let userTwoStarredRepos = []
let userOneFollowers = []
let userTwoFollowers = []
let flagOneStarsFetchFinished = false
let flagTwoStarsFetchFinished = false
let flagOneFollowersFetchFinished = false
let flagTwoFollowersFetchFinished = false
this.errorMessageFieldOne = ''
this.errorMessageFieldTwo = ''

let config = {
	headers: {'Authorization': 'token 9fe7d8694b28e3dce90adc73afb992e60ca2d7d7'}
}

const collectUserOnestarredRepos = (username) => {
	Promise.all([
	  	axios.get('https://api.github.com/users/'+username+'/starred?page='+countStarsOne+'&per_page=100', config)
	]).then(response => {
		response.forEach(res => {
			if (res.data.length > 0) {
				res.data.forEach(result => {
					userOneStarredRepos.push(result)
				})
				countStarsOne++
				collectUserOnestarredRepos(username)
			} else {
				flagOneStarsFetchFinished = true
			}
		})
	}).catch(() => {
		this.errorMessageFieldOne = 'Either you have misspelled the name or the User '+username+' you are seaching is not found'
	})
}

const collectUserTwostarredRepos = (username) => {
	Promise.all([
		axios.get('https://api.github.com/users/'+username+'/starred?page='+countStarsTwo+'&per_page=100', config)
	]).then(response => {
	  	response.forEach(res => {
			if (res.data.length > 0) {
				// userOneStarredRepos.push(res.data)
				res.data.forEach(result => {
					userTwoStarredRepos.push(result)
				})
				countStarsTwo++
				collectUserTwostarredRepos(username)
			} else {
				flagTwoStarsFetchFinished = true
			}
	  	})
	}).catch(() => {
		this.errorMessageFieldTwo = 'Either you have misspelled the name or the User '+username+' you are seaching is not found'
	})
}

const collectUserOneFollowers = (username) => {
	Promise.all([
		axios.get('https://api.github.com/users/' + username + '/followers?page=' + countFollowersOne + '&per_page=100', config)
	]).then(response => {
		response.forEach(res => {
			if (res.data.length > 0) {
				res.data.forEach(result => {
					Promise.all([
						axios.get(result.url, config)
					]).then(resp => {
						resp.forEach(r => {
							let obj = {}
							if (r.data.followers > 0) {
								obj.followersCount = r.data.followers
							} else {
								obj.followersCount = 0
							}
							obj.res = result
							userOneFollowers.push(obj)
						})
					})
				})
				countFollowersOne++
				collectUserOneFollowers(username)
			} else {
				flagOneFollowersFetchFinished = true
			}
		})
	}).catch(() => {
		this.errorMessageFieldOne = 'Either you have misspelled the name or the User '+username+' you are seaching is not found'
	})
}

const collectUserTwoFollowers = (username) => {
	Promise.all([
		axios.get('https://api.github.com/users/' + username + '/followers?page=' + countFollowersTwo + '&per_page=100', config)
	]).then(response => {
		response.forEach(res => {
			if (res.data.length > 0) {
				res.data.forEach(result => {
					Promise.all([
						axios.get(result.url, config)
					]).then(resp => {
						resp.forEach(r => {
							let obj = {}
							if (r.data.followers > 0) {
								obj.followersCount = r.data.followers
							} else {
								obj.followersCount = 0
							}
							obj.res = result
							userTwoFollowers.push(obj)
						})
					})
				})
				countFollowersTwo++
				collectUserTwoFollowers(username)
			} else {
				flagTwoFollowersFetchFinished = true
			}
		})
	}).catch(() => {
		this.errorMessageFieldTwo = 'Either you have misspelled the name or the User '+username+' you are seaching is not found'
	})
}

const collectStarsData = {
	'collectUserOnestarredRepos': collectUserOnestarredRepos,
	'collectUserTwostarredRepos': collectUserTwostarredRepos
}

const collectFollowersData = {
	'collectUserOneFollowers': collectUserOneFollowers,
	'collectUserTwoFollowers': collectUserTwoFollowers
}

export {
	collectStarsData,
	collectFollowersData,
	userOneStarredRepos,
	userTwoStarredRepos,
	flagOneStarsFetchFinished,
	flagTwoStarsFetchFinished,
	userOneFollowers,
	userTwoFollowers,
	flagOneFollowersFetchFinished,
	flagTwoFollowersFetchFinished
}