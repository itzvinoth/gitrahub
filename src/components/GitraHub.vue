<template>
  <div>
    <div>
      <a href="https://github.com/mevinoth/gitrahub" target="_blank" title="click to go github repo link">
        <octicon name="mark-github" height="48" width="48" color="#95aebb"></octicon>
      </a>
      <div class="mb-2">
      </div>
    </div>
    <form>
      <div class="container-lg clearfix">
        <div class="col-6 float-left border p-6">
          <dl class="form-group errored">
            <dd><input class="form-control" type="text" v-model="inputone" placeholder="Enter github username or profile URL"></dd>
            <dd class="error" id="form-error-text" v-if="(errorMessageFieldOne !== undefined && errorMessageFieldOne !== '')"> {{ errorMessageFieldOne }} </dd>
          </dl>
        </div>
        <div class="col-6 float-left border p-6">
          <dl class="form-group errored">
            <dd><input class="form-control" type="text" v-model="inputtwo" placeholder="Enter github username or profile URL"></dd>
            <dd class="error" id="form-error-text" v-if="(errorMessageFieldTwo !== undefined && errorMessageFieldTwo !== '')"> {{ errorMessageFieldTwo }} </dd>
          </dl>
        </div>
      </div>
    </form>
    <div class="container-lg clearfix">
      <div class="col-11 m-6">
        <button @click="fetchDetails($event)" type="submit" class="btn btn-primary" :disabled="interestButtonDisabled">Find mutual interests</button>
      </div>
    </div>

    <div class="container-lg clearfix">
      <nav class="UnderlineNav UnderlineNav--full" aria-label="Foo bar" v-if="((starsResult !== undefined && starsResult.length > 0) || (followersResult !== undefined && followersResult.length > 0))">
        <div class="container-lg UnderlineNav-container">
          <div class="UnderlineNav-body">
            <a href="#" class="UnderlineNav-item" :class="{'selected': (index === tabSelectionIndex)}" v-for="(item, index) in items" :key="index" @click="onTabSelect(index, $event)">{{ item.message }}
            </a>
          </div>
        </div>
      </nav>
      <div v-if="tabSelectionIndex === 0">
        <vue-simple-spinner v-if="starsResult !== undefined && starsResult.length <= 0 && showSpinner" line-fg-color="#7bc96f"></vue-simple-spinner>
        <div id="venn" v-show="(starsResult !== undefined && starsResult.length > 0 || mutualStarred.length > 0 || userOneStarred.length > 0 || userTwoStarred.length > 0)"></div>
        <div class="container-lg clearfix" v-if="(starsResult !== undefined && starsResult.length > 0 || mutualStarred.length > 0 || userOneStarred.length > 0 || userTwoStarred.length > 0)">
          <div class="col-3 float-left p-4">
          </div>
          <div class="col-3 float-left p-4">
            <input class="form-control" v-model="searchRepos" style="width: 100%" type="text" placeholder="Search starred repositories..">
          </div>
          <div class="col-3 float-left p-4">
            <div class="select-menu js-menu-container js-select-menu">
              <button class="btn select-menu-button js-menu-target" type="button" aria-haspopup="true" aria-expanded="false" style="width: 100%">
                Sort: {{ sortRepos }}
              </button>
              <div class="select-menu-modal-holder">
                <div class="select-menu-modal js-menu-content">
                  <div class="select-menu-header js-navigation-enable" tabindex="-1">
                    <button class="btn-link close-button js-menu-close" type="button"><octicon name="x" aria-label="Close menu"></octicon></button>
                    <span class="select-menu-title">Sort options:</span>
                  </div>
                  <div class="select-menu-list js-navigation-container">
                    <a @click.prevent.stop="onSelectSort('Default')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Default</span>
                    </a>
                    <a @click.prevent.stop="onSelectSort('Most stars')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Most stars</span>
                    </a>
                    <a @click.prevent.stop="onSelectSort('Least stars')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Least stars</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3 float-left p-4">
            <div class="select-menu js-menu-container js-select-menu">
              <button class="btn select-menu-button js-menu-target" type="button" aria-haspopup="true" aria-expanded="false">
                Language: {{ (selectedLanguage == '') ? 'All languages' : selectedLanguage }}
              </button>
              <div class="select-menu-modal-holder">
                <div class="select-menu-modal js-menu-content">
                  <div class="select-menu-header js-navigation-enable" tabindex="-1">
                    <button class="btn-link close-button js-menu-close" type="button"><octicon name="x" aria-label="Close menu"></octicon></button>
                    <span class="select-menu-title">Select language:</span>
                  </div>
                  <div class="select-menu-list js-navigation-container">
                    <a @click.prevent="onSelectLang('')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">All languages</span>
                    </a>
                    <a v-for="(lang, index) in uniqueLanguages" :key="index" @click.prevent="onSelectLang(lang)" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">{{lang}}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(star, index) in starsResult" class="col-4 float-left p-2" :key="index">
          <span class="tooltipped tooltipped-multiline tooltipped-ne tooltipped-align-left-1 p-2 mb-2 mr-2 float-left" :aria-label="`${star.name}:  ${(star.description !== null) ? star.description : 'No Descriptions found'}`">
            <octicon name="info"></octicon>
          </span>
          <div class="Box">
            <div class="Box-row d-flex flex-wrap flex-items-center">
              <div class="flex-auto">
                <strong>{{ (star.name.length > 16) ? star.name.slice(0, 16).concat('..') : star.name }}</strong>
                <div class="text-small text-gray-light">
                  {{ (star.description !== null) ? star.description.slice(0, 20).concat('..') : "--" }}
                </div>
              </div>
              <div class="clearfix">
                <a class="btn btn-sm" target='_blank' :href="`${star.htmlurl}`" role="button">
                  <octicon name="star"></octicon> {{ star.gazerscount }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tabSelectionIndex === 1">
        <vue-simple-spinner v-if="followersResult !== undefined && followersResult.length <= 0 && showSpinner" line-fg-color="#7bc96f"></vue-simple-spinner>
        <div id="venn" v-show="(followersResult !== undefined && followersResult.length > 0 || mutualFollowers.length > 0 || userOneFollowers.length > 0 || userTwoFollowers > 0)"></div>
        <div class="container-lg clearfix" v-if="(followersResult !== undefined && followersResult.length > 0 || mutualFollowers.length > 0 || userOneFollowers.length > 0 || userTwoFollowers > 0)">
          <div class="col-6 float-left p-4">
          </div>
          <div class="col-3 float-left p-4">
            <input class="form-control" v-model="searchFollowers" style="width: 100%" type="text" placeholder="Search followers..">
          </div>
           <div class="col-3 float-left p-4">
            <div class="select-menu js-menu-container js-select-menu">
              <button class="btn select-menu-button js-menu-target" type="button" aria-haspopup="true" aria-expanded="false" style="width: 100%">
                Sort: {{ sortFollowers }}
              </button>
              <div class="select-menu-modal-holder">
                <div class="select-menu-modal js-menu-content">
                  <div class="select-menu-header js-navigation-enable" tabindex="-1">
                    <button class="btn-link close-button js-menu-close" type="button"><octicon name="x" aria-label="Close menu"></octicon></button>
                    <span class="select-menu-title">Sort options:</span>
                  </div>
                  <div class="select-menu-list js-navigation-container">
                    <a @click.prevent.stop="onSelectFollowersSort('Default')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Default</span>
                    </a>
                    <a @click.prevent.stop="onSelectFollowersSort('Most followers')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Most followers</span>
                    </a>
                    <a @click.prevent.stop="onSelectFollowersSort('Least followers')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Least followers</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(follower, index) in followersResult" class="col-4 float-left p-2" :key="index">
          <div class="Box">
            <div class="Box-row d-flex flex-wrap flex-items-center">
              <div class="flex-auto">
                <strong>{{ (follower.name.length > 22) ? follower.name.slice(0, 22).concat('..') : follower.name }}</strong>
              </div>
              <div class="clearfix">
                <a class="btn btn-sm" target='_blank' :href="`${follower.htmlurl}`" role="button">
                  <span class="Counter">{{ follower.count }}</span>  <octicon name="link-external"></octicon>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tabSelectionIndex === 2">
        <vue-simple-spinner v-if="followingsResult !== undefined && followingsResult.length <= 0 && showSpinner" line-fg-color="#7bc96f"></vue-simple-spinner>
        <div id="venn" v-show="(followingsResult !== undefined && followingsResult.length > 0 || mutualFollowings.length > 0 || userOneFollowings.length > 0 || userTwoFollowings > 0)"></div>
        <div class="container-lg clearfix" v-if="(followingsResult !== undefined && followingsResult.length > 0 || mutualFollowings.length > 0 || userOneFollowings.length > 0 || userTwoFollowings > 0)">
          <div class="col-6 float-left p-4">
          </div>
          <div class="col-3 float-left p-4">
            <input class="form-control" v-model="searchFollowings" style="width: 100%" type="text" placeholder="Search followings..">
          </div>
           <div class="col-3 float-left p-4">
            <div class="select-menu js-menu-container js-select-menu">
              <button class="btn select-menu-button js-menu-target" type="button" aria-haspopup="true" aria-expanded="false" style="width: 100%">
                Sort: {{ sortFollowings }}
              </button>
              <div class="select-menu-modal-holder">
                <div class="select-menu-modal js-menu-content">
                  <div class="select-menu-header js-navigation-enable" tabindex="-1">
                    <button class="btn-link close-button js-menu-close" type="button"><octicon name="x" aria-label="Close menu"></octicon></button>
                    <span class="select-menu-title">Sort options:</span>
                  </div>
                  <div class="select-menu-list js-navigation-container">
                    <a @click.prevent.stop="onSelectFollowingsSort('Default')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Default</span>
                    </a>
                    <a @click.prevent.stop="onSelectFollowingsSort('Most followings')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Most followings</span>
                    </a>
                    <a @click.prevent.stop="onSelectFollowingsSort('Least followings')" class="select-menu-item selected js-navigation-item">
                      <span class="select-menu-item-text js-select-button-text">Least followings</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(follower, index) in followingsResult" class="col-4 float-left p-2" :key="index">
          <div class="Box">
            <div class="Box-row d-flex flex-wrap flex-items-center">
              <div class="flex-auto">
                <strong>{{ (follower.name.length > 22) ? follower.name.slice(0, 22).concat('..') : follower.name }}</strong>
              </div>
              <div class="clearfix">
                <a class="btn btn-sm" target='_blank' :href="`${follower.htmlurl}`" role="button">
                  <span class="Counter">{{ follower.count }}</span>  <octicon name="link-external"></octicon>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import Spinner from 'vue-simple-spinner'
import Octicon from 'vue-octicon/components/Octicon.vue'
import 'vue-octicon/icons/link-external'
import 'vue-octicon/icons/star'
import 'vue-octicon/icons/check'
import 'vue-octicon/icons/x'
import 'vue-octicon/icons/info'
import 'vue-octicon/icons/mark-github'
import { intersection } from '../assets/js/intersection'
import * as d3 from 'd3'
import store from '../store'
import { mapGetters, mapActions } from 'vuex'

let countStarsOne
let countStarsTwo
let userOneStarredRepos
let userTwoStarredRepos
let flagOneStarsFetchFinished
let flagTwoStarsFetchFinished
let countFollowersOne
let countFollowersTwo
let userOneFollowers
let userTwoFollowers
let flagOneFollowersFetchFinished
let flagTwoFollowersFetchFinished
let countFollowingsOne
let countFollowingsTwo
let userOneFollowings
let userTwoFollowings
let flagOneFollowingsFetchFinished
let flagTwoFollowingsFetchFinished

let config = {
	headers: {'Authorization': 'token 9fe7d8694b28e3dce90adc73afb992e60ca2d7d7'}
}

// Generate github tokens under this URL. Once you landed the page create your
// own token using `Generate new token` button on the right side of your page..
// Now get ready to play with gitrahub
// https://github.com/settings/tokens

export default {
  name: 'GitraHub',
  components: {
    'vue-simple-spinner': Spinner,
    'octicon': Octicon
    // 'date-picker': DatePicker
  },
  data () {
    return {
      inputone: '',
      inputtwo: '',
      showSpinner: false,
      flashBanner: '',
      intersectionPortion: true,
      leftSetPortion: false,
      rightSetPortion: false,
      uniqueLanguages: [],
      selectedLanguage: '',
      sortRepos: 'Default',
      sortFollowers: 'Default',
      sortFollowings: 'Default',
      searchRepos: '',
      searchFollowers: '',
      searchFollowings: '',
      tabSelectionIndex: 0,
      interestButtonDisabled: false,
      items: [
        { message: 'Stars', name: 'starred' },
        { message: 'Followers', name: 'followers' },
        { message: 'Following', name: 'following' }
      ]
    }
  },
  watch: {
    inputone: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.inputFieldChange()

      }
    },
    inputtwo: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.inputFieldChange()
      }
    }
  },
  computed: {
    ...mapGetters(['mutualStarred', 'userOneStarred', 'userTwoStarred', 'mutualFollowers', 'userOneFollowers', 'userTwoFollowers', 'mutualFollowings', 'userOneFollowings', 'userTwoFollowings', 'errorMessageFieldOne', 'errorMessageFieldTwo']),
    followingsResult () {
      let userOneFollowings = this.userOneFollowings
      let userTwoFollowings = this.userTwoFollowings
      let mutualFollowings = this.mutualFollowings
      let followingsList = [], finalFollowingsList = []
      if (this.leftSetPortion) {
        followingsList.push({ 'arr': userOneFollowings, 'key': 'left' })
      }
      if (this.rightSetPortion) {
        followingsList.push({ 'arr': userTwoFollowings, 'key': 'right' })
      }
      if (this.intersectionPortion) {
        followingsList.push({ 'arr': mutualFollowings, 'key': 'center' })
      }
      let followingsListKey = followingsList.map(val => val.key)
      if (this.leftSetPortion === false && followingsListKey.indexOf('left') !== -1) {
        followingsList.splice(followingsListKey.indexOf('left'), 1)
      }
      if (this.rightSetPortion === false && followingsListKey.indexOf('right') !== -1) {
        followingsList.splice(followingsListKey.indexOf('right'), 1)
      }
      if (this.intersectionPortion === false && followingsListKey.indexOf('center') !== -1) {
        followingsList.splice(followingsListKey.indexOf('center'), 1)
      }
      for (let i in followingsList) {
        finalFollowingsList.push(followingsList[i].arr)
      }

      let result = Array.prototype.concat.apply([], finalFollowingsList)
      if (this.sortFollowings !== 'Default') {
        if (this.sortFollowings === 'Most followers') {
          result = result.slice().sort(function (a, b) {
            return b.count - a.count
          })
        } else {
          result = result.slice().sort(function (a, b) {
            return a.count - b.count
          })
        }
      }
      if (this.searchFollowings !== '') {
        let searchedFollowings = []
        result.map((res) => {
          if (res.name.indexOf(this.searchFollowings) !== -1) {
            searchedFollowings.push(res)
          }
        })
        return searchedFollowings
      }
      return result
    },
    followersResult () {
      let userOneFollowers = this.userOneFollowers
      let userTwoFollowers = this.userTwoFollowers
      let mutualFollowers = this.mutualFollowers
      let followersList = [], finalFollowersList = []
      if (this.leftSetPortion) {
        followersList.push({ 'arr': userOneFollowers, 'key': 'left' })
      }
      if (this.rightSetPortion) {
        followersList.push({ 'arr': userTwoFollowers, 'key': 'right' })
      }
      if (this.intersectionPortion) {
        followersList.push({ 'arr': mutualFollowers, 'key': 'center' })
      }
      let followersListKey = followersList.map(val => val.key)
      if (this.leftSetPortion === false && followersListKey.indexOf('left') !== -1) {
        followersList.splice(followersListKey.indexOf('left'), 1)
      }
      if (this.rightSetPortion === false && followersListKey.indexOf('right') !== -1) {
        followersList.splice(followersListKey.indexOf('right'), 1)
      }
      if (this.intersectionPortion === false && followersListKey.indexOf('center') !== -1) {
        followersList.splice(followersListKey.indexOf('center'), 1)
      }
      for (let i in followersList) {
        finalFollowersList.push(followersList[i].arr)
      }

      let result = Array.prototype.concat.apply([], finalFollowersList)
      if (this.sortFollowers !== 'Default') {
        if (this.sortFollowers === 'Most followers') {
          result = result.slice().sort(function (a, b) {
            return b.count - a.count
          })
        } else {
          result = result.slice().sort(function (a, b) {
            return a.count - b.count
          })
        }
      }
      if (this.searchFollowers !== '') {
        let searchedFollowers = []
        result.map((res) => {
          if (res.name.indexOf(this.searchFollowers) !== -1) {
            searchedFollowers.push(res)
          }
        })
        return searchedFollowers
      }
      return result
    },
    starsResult () {
      let userOneStarred = this.userOneStarred
      let userTwoStarred = this.userTwoStarred
      let mutualStarred = this.mutualStarred
      let starsList = [], finalStarsList=[], obj

      // Based on selecting the 'Venn diagram selection' area the starred repos will be pushed into the star list array
      // this.pushStarReposToList(starsList)
      if (this.leftSetPortion) {
        starsList.push({ 'arr': userOneStarred, 'key': 'left' })
      }
      if (this.rightSetPortion) {
        starsList.push({ 'arr': userTwoStarred, 'key': 'right' })
      }
      if (this.intersectionPortion) {
        starsList.push({ 'arr': mutualStarred, 'key': 'center' })
      }

      // Based on unselecting the 'Venn diagram selection' area the starred repos will be popped from the star list array
      // this.popStarReposFromList(starsList)
      let starsListKey = starsList.map(val => val.key)
      if (this.leftSetPortion === false && starsListKey.indexOf('left') !== -1) {
        starsList.splice(starsListKey.indexOf('left'), 1)
      }
      if (this.rightSetPortion === false && starsListKey.indexOf('right') !== -1) {
        starsList.splice(starsListKey.indexOf('right'), 1)
      }
      if (this.intersectionPortion === false && starsListKey.indexOf('center') !== -1) {
        starsList.splice(starsListKey.indexOf('center'), 1)
      }

      // 'finalStarsList' contains the final list of starred repos
      for (let i in starsList) {
        finalStarsList.push(starsList[i].arr)
      }

      let result = Array.prototype.concat.apply([], finalStarsList)

      if (this.sortRepos !== 'Default') {
        // this.onSortRepos(result)
        if (this.sortRepos === 'Most stars') {
          result = result.slice().sort(function (a, b) {
            return b.gazerscount - a.gazerscount
          })
        } else {
          result = result.slice().sort(function (a, b) {
            return a.gazerscount - b.gazerscount
          })
        }
      }

      if (this.searchRepos !== '') {
        let searchedRepos = []
        result.map((res) => {
          if (res.name.indexOf(this.searchRepos) !== -1) {
            searchedRepos.push(res)
          }
        })
        return searchedRepos
      }

      result.forEach((l) => {
        if (this.uniqueLanguages.indexOf(l.language) === -1 && l.language !== null) {
          this.uniqueLanguages.push(l.language)
        }
      })
      if (this.selectedLanguage !== '') {
        // this.onFilterRepos(result)
        let filteredRepos = []
        result.map((res) => {
          if (res.language !== null && res.language === this.selectedLanguage) {
            filteredRepos.push(res)
          }
        })
        return filteredRepos
      } else {
        return result
      }

    }
  },
  mounted () {
    // define sets and set set intersections
    let width = 700, height = 250
    let circleData = [
      { 'cx': 300, 'cy': 120, 'id': 'cir1' ,'radius': 80, 'color' : '#7bc96f', 'align' : 'end' },
      { 'cx': 400, 'cy': 120, 'id': 'cir2' ,'radius': 80, 'color' : '#7bc96f', 'align' : 'start' }]

    var svgContainer = d3.select('#venn').append('svg')
        .attr('width', width)
        .attr('height', height)
    // Add circles to the svgContainer
    var circles = svgContainer.selectAll("circle")
                           .data(circleData)
                           .enter()
                           .append("circle")
    // Add the circle attributes
    var circleAttributes = circles
                       .attr('cx', function (d) { return d.cx; })
                       .attr('cy', function (d) { return d.cy; })
                       .attr('r', function (d) { return d.radius; })
                       .attr('id', function (d) { return d.id; })
                       .style('fill', function (d) { return d.color; })
                       .style('fill-opacity', '.9')
                       .style('font-size', '14px')
                       .on('mouseover', function (d) {
                         d3.select(this).style('cursor', 'pointer')
                       })
                       .on('click', this.onSelectCircle)
    // Add the SVG Text Element to the svgContainer
    var text = svgContainer.selectAll("text")
                        .data(circleData)
                        .enter()
                        .append("text")
    // Add SVG Text Element Attributes
    var textLabels = text
                 .attr('x', function(d) { return d.cx; })
                 .attr('y', function(d) { return d.cy; })
                 .text( function (d) { return d.name; })
                 .attr('text-anchor', function (d) { return d.align; })
                 .attr('font-family', 'sans-serif')
                 .attr('font-size', '15px')
                 .attr('fill', '#FFF')
    let x1 = circleData[0]['cx']
    let y1 = circleData[0]['cy']
    let x2 = circleData[1]['cx']
    let y2 = circleData[1]['cy']
    let r = circleData[0]['radius']
    var interPoints = intersection(x1, y1, r, x2, y2, r)
    svgContainer.append('g')
      .append('path')
      .attr('d', function() {
        return 'M' + interPoints[0] + ',' + interPoints[2] + 'A' + r + ',' + r +
          ' 0 0,1 ' + interPoints[1] + ',' + interPoints[3]+ 'A' + r + ',' + r +
          ' 0 0,1 ' + interPoints[0] + ',' + interPoints[2]
      })
      .attr('id', 'intersec')
      .on('mouseover', function (d) {
        d3.select(this).style('cursor', 'pointer')
      })
      .style('fill', '#239a3b').on('click', this.onSelectIntersection)
  },
  methods: {
    ...mapActions(['getStarsInfo', 'getFollowersInfo', 'getFollowingsInfo']),
    inputFieldChange () {
      this.interestButtonDisabled = false
    },
    onTabSelect (index, event) {
      this.tabSelectionIndex = index
      this.fetchDetails(event)
    },
    onSelectSort (sort) {
      this.sortRepos = sort
      this.searchRepos = ''
    },
    onSelectFollowersSort (sort) {
      this.sortFollowers = sort
      this.searchFollowers = ''
    },
    onSelectFollowingsSort (sort) {
      this.sortFollowings = sort
      this.searchFollowings = ''
    },
    onSelectLang (lang) {
      this.selectedLanguage = lang
      this.searchRepos = ''
    },
    onPortionSelection (d, setPortion, setFillColor) {
      if (d.cx == 300) {
        this.leftSetPortion = setPortion
      } else {
        this.rightSetPortion = setPortion
      }
      d3.select('#'+d.id).style('fill', setFillColor)
    },
    onSelectCircle (d) {
      // rgb(35, 154, 59)
      let isCircleSelected = (d3.select('#'+d.id).style('fill') == 'rgb(123, 201, 111)')
      let setPortion = isCircleSelected ? true : false
      let setFillColor = isCircleSelected ? '#239a3b' : '#7bc96f'
      this.onPortionSelection(d, setPortion, setFillColor)
      this.uniqueLanguages = []
      this.selectedLanguage = ''
      this.searchRepos = ''
    },
    onSelectIntersection (d) {
      if (d3.select('#intersec').style('fill') == 'rgb(123, 201, 111)') {
        // intersection portion not selected yet..
        this.intersectionPortion = true
        d3.select('#intersec').style('fill', '#239a3b')
      } else {
        this.intersectionPortion = false
        d3.select('#intersec').style('fill', '#7bc96f')
      }
      this.uniqueLanguages = []
      this.selectedLanguage = ''
      this.searchRepos = ''
    },
    fetchDetails (event) {
      this.interestButtonDisabled = true
      let userOne, userTwo

      userOne = (this.inputone.split('/').length > 2) ? this.inputone.split('/')[3] : this.inputone
      userTwo = (this.inputtwo.split('/').length > 2) ? this.inputtwo.split('/')[3] : this.inputtwo

      let userDetails = []
      userDetails[0] = (userOne.length > 9) ? userOne.slice(0, 7).concat('..') : userOne
      userDetails[1] = (userTwo.length > 9) ? userTwo.slice(0, 7).concat('..') : userTwo
      d3.select('#venn').selectAll('text').text(function (d, i) { return userDetails[i] })

      countStarsOne = 1
      countStarsTwo = 1
      userOneStarredRepos = []
      userTwoStarredRepos = []
      flagOneStarsFetchFinished = false
      flagTwoStarsFetchFinished = false
      countFollowersOne = 1
      countFollowersTwo = 1
      userOneFollowers = []
      userTwoFollowers = []
      flagOneFollowersFetchFinished = false
      flagTwoFollowersFetchFinished = false
      countFollowingsOne = 1
      countFollowingsTwo = 1
      userOneFollowings = []
      userTwoFollowings = []
      flagOneFollowingsFetchFinished = false
      flagTwoFollowingsFetchFinished = false

      if (userOne !== '' && userTwo !== '') {
        this.uniqueLanguages = []
        this.selectedLanguage = ''
        this.searchRepos = ''
        this.showSpinner = true
        // replace below access token with your github access token..

        // use access
        let getTabSectionName = this.items[this.tabSelectionIndex]['name']

        if (getTabSectionName === 'starred') {
          collectUserOnestarredRepos(userOne)
          collectUserTwostarredRepos(userTwo)
          function collectUserOnestarredRepos(username) {
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
          function collectUserTwostarredRepos(username) {
            Promise.all([
              axios.get('https://api.github.com/users/'+username+'/starred?page='+countStarsTwo+'&per_page=100', config)
            ]).then(response => {
              response.forEach(res => {
                if (res.data.length > 0) {
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
          var isStarsFetchFinished = function () {
            if (flagOneStarsFetchFinished && flagTwoStarsFetchFinished) {
              let mutualStarred = [],
                  userOneStarred = [],
                  userTwoStarred = []
              if (starsCheckerFlag) {
                window.clearInterval(starsCheckerFlag)
              }

              var mostStarred, leastStarred
              if (userTwoStarredRepos.length > userOneStarredRepos.length) {
                mostStarred = userTwoStarredRepos
                leastStarred = userOneStarredRepos
              } else {
                mostStarred = userOneStarredRepos
                leastStarred = userTwoStarredRepos
              }

              leastStarred.map((item, index) => {
                if (mostStarred.map(val => val.html_url).indexOf(item.html_url) > -1) {
                  let star = {}
                  star.name = item.name
                  star.description = item.description
                  star.htmlurl = item.html_url
                  star.gazerscount = item.stargazers_count
                  star.language = item.language
                  mutualStarred.push(star)
                }
              })

              userOneStarredRepos.map((item, index) => {
                if (mutualStarred.map(val => val.htmlurl).indexOf(item.html_url) === -1) {
                  let star = {}
                  star.name = item.name
                  star.description = item.description
                  star.htmlurl = item.html_url
                  star.gazerscount = item.stargazers_count
                  star.language = item.language
                  userOneStarred.push(star)
                }
              })

              userTwoStarredRepos.map((item, index) => {
                if (mutualStarred.map(val => val.htmlurl).indexOf(item.html_url) === -1) {
                  let star = {}
                  star.name = item.name
                  star.description = item.description
                  star.htmlurl = item.html_url
                  star.gazerscount = item.stargazers_count
                  star.language = item.language
                  userTwoStarred.push(star)
                }
              })

              let starsInfo = {
                mutualStarred,
                userOneStarred,
                userTwoStarred
              }
              this.getStarsInfo(starsInfo)
              this.showSpinner = false
            }
          }.bind(this)
          var starsCheckerFlag = window.setInterval(isStarsFetchFinished, 300)
        }
        if (getTabSectionName === 'followers') {
          collectUserOneFollowers(userOne)
          collectUserTwoFollowers(userTwo)
          function collectUserOneFollowers(username) {
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
          function collectUserTwoFollowers(username) {
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
          var isFollowersFetchFinished = function () {
            if (flagOneFollowersFetchFinished && flagTwoFollowersFetchFinished) {
              let mutualFollowers = [],
                  uniqueUserOneFollowers = [],
                  uniqueUserTwoFollowers = []
              if (followersCheckerFlag) {
                window.clearInterval(followersCheckerFlag)
              }
              var mostFollowers, leastFollowers
              if (userTwoFollowers.length > userOneFollowers.length) {
                mostFollowers = userTwoFollowers
                leastFollowers = userOneFollowers
              } else {
                mostFollowers = userOneFollowers
                leastFollowers = userTwoFollowers
              }

              leastFollowers.map((item, index) => {
                if (mostFollowers.map(val => val.res.html_url).indexOf(item.res.html_url) > -1) {
                  let follower = {}
                  follower.name = item.res.login
                  follower.htmlurl = item.res.html_url
                  follower.url = item.res.url
                  follower.count = item.followersCount
                  mutualFollowers.push(follower)
                }
              })
              userOneFollowers.map((item, index) => {
                if (mutualFollowers.map(val => val.htmlurl).indexOf(item.res.html_url) === -1) {
                  let follower = {}
                  follower.name = item.res.login
                  follower.htmlurl = item.res.html_url
                  follower.url = item.res.url
                  follower.count = item.followersCount
                  uniqueUserOneFollowers.push(follower)
                }
              })
              userTwoFollowers.map((item, index) => {
                if (mutualFollowers.map(val => val.htmlurl).indexOf(item.res.html_url) === -1) {
                  let follower = {}
                  follower.name = item.res.login
                  follower.htmlurl = item.res.html_url
                  follower.url = item.res.url
                  follower.count = item.followersCount
                  uniqueUserTwoFollowers.push(follower)
                }
              })

              let followersInfo = {
                mutualFollowers,
                userOneFollowers: uniqueUserOneFollowers,
                userTwoFollowers: uniqueUserTwoFollowers
              }

              this.getFollowersInfo(followersInfo)
              this.showSpinner = false
            }
          }.bind(this)
          var followersCheckerFlag = window.setInterval(isFollowersFetchFinished, 300)
        }
        if (getTabSectionName === 'following') {
          collectUserOneFollowings(userOne)
          collectUserTwoFollowings(userTwo)
          function collectUserOneFollowings(username) {
            Promise.all([
              axios.get('https://api.github.com/users/' + username + '/following?page=' + countFollowingsOne + '&per_page=100', config)
            ]).then(response => {
              response.forEach(res => {
                if (res.data.length > 0) {
                  res.data.forEach(result => {
                    Promise.all([
                      axios.get(result.url, config)
                    ]).then(resp => {
                      resp.forEach(r => {
                        let obj = {}
                        if (r.data.following > 0) {
                          obj.followingsCount = r.data.following
                        } else {
                          obj.followingsCount = 0
                        }
                        obj.res = result
                        userOneFollowings.push(obj)
                      })
                    })
                  })
                  countFollowingsOne++
                  collectUserOneFollowings(username)
                } else {
                  flagOneFollowingsFetchFinished = true
                }
              })
            }).catch(() => {
              this.errorMessageFieldOne = 'Either you have misspelled the name or the User '+username+' you are seaching is not found'
            })
          }
          function collectUserTwoFollowings(username) {
            Promise.all([
              axios.get('https://api.github.com/users/' + username + '/following?page=' + countFollowingsTwo + '&per_page=100', config)
            ]).then(response => {
              response.forEach(res => {
                if (res.data.length > 0) {
                  res.data.forEach(result => {
                    Promise.all([
                      axios.get(result.url, config)
                    ]).then(resp => {
                      resp.forEach(r => {
                        let obj = {}
                        if (r.data.following > 0) {
                          obj.followingsCount = r.data.following
                        } else {
                          obj.followingsCount = 0
                        }
                        obj.res = result
                        userTwoFollowings.push(obj)
                      })
                    })
                  })
                  countFollowingsTwo++
                  collectUserTwoFollowings(username)
                } else {
                  flagTwoFollowingsFetchFinished = true
                }
              })
            }).catch(() => {
              this.errorMessageFieldTwo = 'Either you have misspelled the name or the User '+username+' you are seaching is not found'
            })
          }
          var isFollowingsFetchFinished = function () {
            if (flagOneFollowingsFetchFinished && flagTwoFollowingsFetchFinished) {
              let mutualFollowings = [],
                  uniqueUserOneFollowings = [],
                  uniqueUserTwoFollowings = []
              if (followingsCheckerFlag) {
                window.clearInterval(followingsCheckerFlag)
              }
              var mostFollowings, leastFollowings
              if (userTwoFollowings.length > userOneFollowings.length) {
                mostFollowings = userTwoFollowings
                leastFollowings = userOneFollowings
              } else {
                mostFollowings = userOneFollowings
                leastFollowings = userTwoFollowings
              }

              leastFollowings.map((item, index) => {
                if (mostFollowings.map(val => val.res.html_url).indexOf(item.res.html_url) > -1) {
                  let following = {}
                  following.name = item.res.login
                  following.htmlurl = item.res.html_url
                  following.url = item.res.url
                  following.count = item.followingsCount
                  mutualFollowings.push(following)
                }
              })
              userOneFollowings.map((item, index) => {
                if (mutualFollowings.map(val => val.htmlurl).indexOf(item.res.html_url) === -1) {
                  let following = {}
                  following.name = item.res.login
                  following.htmlurl = item.res.html_url
                  following.url = item.res.url
                  following.count = item.followingsCount
                  uniqueUserOneFollowings.push(following)
                }
              })
              userTwoFollowings.map((item, index) => {
                if (mutualFollowings.map(val => val.htmlurl).indexOf(item.res.html_url) === -1) {
                  let following = {}
                  following.name = item.res.login
                  following.htmlurl = item.res.html_url
                  following.url = item.res.url
                  following.count = item.followingsCount
                  uniqueUserTwoFollowings.push(following)
                }
              })

              let followingsInfo = {
                mutualFollowings,
                userOneFollowings: uniqueUserOneFollowings,
                userTwoFollowings: uniqueUserTwoFollowings
              }

              this.getFollowingsInfo(followingsInfo)
              this.showSpinner = false
            }
          }.bind(this)
          var followingsCheckerFlag = window.setInterval(isFollowingsFetchFinished, 300)
        }

      } else if (userOne === '' || userTwo === '') {
        if (userOne === '') {
          this.errorMessageFieldOne = 'Input Field should not be empty.'
        }
        if (userTwo === '') {
          this.errorMessageFieldTwo = 'Input Field should not be empty.'
        }
      }
      event.preventDefault()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>