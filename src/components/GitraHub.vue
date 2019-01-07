<template>
  <div>
    <!-- <div class="col-6 p-2 mx-auto border m-5">
      <form>
        <input class="form-control input-monospace input-block" type="text" placeholder="Github Access Token" aria-label="SHA">
      </form>
    </div> -->
    <!-- <div class="select-menu js-menu-container js-select-menu">
      <button class="btn select-menu-button js-menu-target" type="button" aria-haspopup="true" aria-expanded="false">
        Choose an item
      </button>
      <div class="select-menu-modal-holder">
        <div class="select-menu-modal js-menu-content" aria-expanded="false">
          <div class="select-menu-list js-navigation-container">
            <a href="#" class="select-menu-item selected js-navigation-item" aria-expanded="false">
              <octicon name="check" class="select-menu-item-icon"></octicon>
              <span class="select-menu-item-text js-select-button-text">Item 1</span>
            </a>
          </div>
        </div>
      </div>
    </div> -->
    <div>
      <octicon name="mark-github" height="48" width="48" color="#95aebb"></octicon>
      <div class="mb-2">
        <!-- <p class="h1"><span style="color: #95aebb">Git</span><span style="color: #1775d0">ra</span><span style="color: #95aebb">hub</span></p> -->
      </div>
    </div>
    <form>
      <div class="container-lg clearfix">
        <div class="col-6 float-left border p-6">
          <dl class="form-group errored">
            vinothkumarrenganathan
            <dd><input class="form-control" type="text" v-model="inputone" placeholder="Enter github username or profile URL"></dd>
            <dd class="error" id="form-error-text" v-if="errorMessageFieldOne !== ''"> {{ errorMessageFieldOne }} </dd>
          </dl>
        </div>
        <div class="col-6 float-left border p-6">
          <dl class="form-group errored">
            Rafi993
            <dd><input class="form-control" type="text" v-model="inputtwo" placeholder="Enter github username or profile URL"></dd>
            <dd class="error" id="form-error-text" v-if="errorMessageFieldTwo !== ''"> {{ errorMessageFieldTwo }} </dd>
          </dl>
        </div>
      </div>
    </form>
    <div class="container-lg clearfix">
      <div class="col-11 m-6">
        <button @click="fetchDetails($event)" type="submit" class="btn btn-primary">Find shared interest</button>
      </div>
    </div>

    <div class="container-lg clearfix">

      <!-- today -->
      <nav class="UnderlineNav UnderlineNav--full" aria-label="Foo bar" v-if="starsResult !== undefined && starsResult.length > 0">
        <div class="container-lg UnderlineNav-container">
          <div class="UnderlineNav-body">
            <!-- <a href="#" class="UnderlineNav-item">Stars
              <span class="Counter">135</span>
            </a> -->
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
import {
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
} from './collectData.js'

// Generate github tokens under this URL. Once you landed the page create your
// own token using `Generate new token` button on the right side of your page..
// Now get ready to play with gitrahub
// https://github.com/settings/tokens

export default {
  name: 'GitraHub',
  components: {
    'vue-simple-spinner': Spinner,
    'octicon': Octicon
  },
  data () {
    return {
      inputone: '',
      inputtwo: '',
      showSpinner: false,
      errorMessageFieldOne: '',
      errorMessageFieldTwo: '',
      flashBanner: '',
      intersectionPortion: true,
      leftSetPortion: false,
      rightSetPortion: false,
      uniqueLanguages: [],
      selectedLanguage: '',
      sortRepos: 'Default',
      sortFollowers: 'Default',
      searchRepos: '',
      searchFollowers: '',
      tabSelectionIndex: 0,
      items: [
        { message: 'Stars', name: 'starred' },
        { message: 'Followers', name: 'followers' },
        { message: 'Following', name: 'following' }
      ]
    }
  },
  computed: {
    ...mapGetters(['mutualStarred', 'userOneStarred', 'userTwoStarred', 'mutualFollowers', 'userOneFollowers', 'userTwoFollowers', 'errorMessageFieldOne', 'errorMessageFieldTwo']),
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
    ...mapActions(['getStarsInfo', 'getFollowersInfo']),
    // onSortRepos (result) {
    //   if (this.sortRepos === 'Most stars') {
    //     result = result.slice().sort(function (a, b) {
    //       return b.gazerscount - a.gazerscount
    //     })
    //   } else {
    //     result = result.slice().sort(function (a, b) {
    //       return a.gazerscount - b.gazerscount
    //     })
    //   }
    // },
    // onSearchRepos (result) {
    //   let searchedRepos = []
    //   result.map((res) => {
    //     if (res.name.indexOf(this.searchRepos) !== -1) {
    //       searchedRepos.push(res)
    //     }
    //   })
    //   return searchedRepos
    // },
    // onFilterRepos (result) {
    //   let filteredRepos = []
    //   result.map((res) => {
    //     if (res.language !== null && res.language === this.selectedLanguage) {
    //       filteredRepos.push(res)
    //     }
    //   })
    //   return filteredRepos
    // },
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
      let userOne, userTwo
      userOne = (this.inputone.split('/').length > 2) ? this.inputone.split('/')[3] : this.inputone
      userTwo = (this.inputtwo.split('/').length > 2) ? this.inputtwo.split('/')[3] : this.inputtwo

      let userDetails = []
      userDetails[0] = (userOne.length > 9) ? userOne.slice(0, 7).concat('..') : userOne
      userDetails[1] = (userTwo.length > 9) ? userTwo.slice(0, 7).concat('..') : userTwo
      d3.select('#venn').selectAll('text').text(function (d, i) { return userDetails[i] })

      if (userOne !== '' && userTwo !== '') {
        this.uniqueLanguages = []
        this.selectedLanguage = ''
        this.searchRepos = ''
        this.showSpinner = true
        // replace below access token with your github access token..

        // use access
        let getTabSectionName = this.items[this.tabSelectionIndex]['name']

        if (getTabSectionName === 'starred') {
          collectStarsData.collectUserOnestarredRepos(userOne)
          collectStarsData.collectUserTwostarredRepos(userTwo)
        }
        if (getTabSectionName === 'followers') {
          collectFollowersData.collectUserOneFollowers(userOne)
          collectFollowersData.collectUserTwoFollowers(userTwo)
        }

        if (getTabSectionName === 'starred') {
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
                leastStarred =userTwoStarredRepos
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

      } else  if (userOne === '' || userTwo === '') {
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