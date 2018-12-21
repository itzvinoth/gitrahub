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
            <dd><input class="form-control" type="text" v-model="inputone" placeholder="Enter github username or profile URL"></dd>
            <dd class="error" id="form-error-text" v-if="errorMessageFieldOne !== ''"> {{ errorMessageFieldOne }} </dd>
          </dl>
        </div>
        <div class="col-6 float-left border p-6">
          <dl class="form-group errored">
            <dd><input class="form-control" type="text" v-model="inputtwo" placeholder="Enter github username or profile URL"></dd>
            <dd class="error" id="form-error-text" v-if="errorMessageFieldTwo !== ''"> {{ errorMessageFieldTwo }} </dd>
          </dl>
        </div>
      </div>
    </form>
    <div class="container-lg clearfix">
      <div class="col-11 m-6">
        <button @click="fetchReposStarred('msg', $event)" type="submit" class="btn btn-primary">Find shared interest</button>
      </div>
    </div>

    <div class="container-lg clearfix">

      <!-- today -->
      <nav class="UnderlineNav UnderlineNav--full" aria-label="Foo bar">
        <div class="container-lg UnderlineNav-container">
          <div class="UnderlineNav-body">
            <!-- <a href="#" class="UnderlineNav-item">Stars
              <span class="Counter">135</span>
            </a> -->
            <a href="#" class="UnderlineNav-item" :class="{'selected': (index === tabSelectionIndex)}" v-for="(item, index) in items" :key="index" @click="tabSelect(index)">{{ item.message }}
            </a>
          </div>
        </div>
      </nav>


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
                  <a @click.prevent.stop="selectSort('Default')" class="select-menu-item selected js-navigation-item">
                    <span class="select-menu-item-text js-select-button-text">Default</span>
                  </a>
                  <a @click.prevent.stop="selectSort('Most stars')" class="select-menu-item selected js-navigation-item">
                    <span class="select-menu-item-text js-select-button-text">Most stars</span>
                  </a>
                  <a @click.prevent.stop="selectSort('Least stars')" class="select-menu-item selected js-navigation-item">
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
                  <a @click.prevent="selectLang('')" class="select-menu-item selected js-navigation-item">
                    <!-- <octicon name="check" class="select-menu-item-icon"></octicon> -->
                    <span class="select-menu-item-text js-select-button-text">All languages</span>
                  </a>
                  <a v-for="(lang, index) in uniqueLanguages" :key="index" @click.prevent="selectLang(lang)" class="select-menu-item selected js-navigation-item">
                    <span class="select-menu-item-text js-select-button-text">{{lang}}</span>
                  </a>
                  <!-- <a href="#url" class="select-menu-item selected js-navigation-item">
                    <octicon name="check" class="select-menu-item-icon"></octicon>
                    <span class="select-menu-item-text js-select-button-text">Item 1</span>
                  </a> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(star, index) in starsResult" class="col-4 float-left p-2" :key="index">
        <span class="tooltipped tooltipped-multiline tooltipped-ne tooltipped-align-left-1 p-2 mb-2 mr-2 float-left" :aria-label="`${star.name}:  ${(star.description !== null) ? star.description : 'No Descriptions, Sorry'}`">
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
            <!-- <div class="Subhead-actions"><a target='_blank' :href="`${star.htmlurl}`" class="btn btn-sm btn-primary" role="button">Link</a></div> -->
            <div class="clearfix">
              <a class="btn btn-sm" target='_blank' :href="`${star.htmlurl}`" role="button">
                <octicon name="star"></octicon> {{ star.gazerscount }}
              </a>
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
// Generate github tokens under this URL. Once you landed the page create your
// own token using `Generate new token` button on the right side of your page..
// Now get ready to play with gitrahub
// https://github.com/settings/tokens

let config = {
  headers: {'Authorization': 'token bfdedafa6d65f58d981e3636a0da390a878560e3'}
}

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
      mutualStarred: [],
      userOneStarred: [],
      userTwoStarred: [],
      mutualFollowers: [],
      userOneFollowers: [],
      userTwoFollowers: [],
      mutualFollowing: [],
      userOneFollowing: [],
      userTwoFollowing: [],
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
      searchRepos: '',
      tabSelectionIndex: 0,
      items: [
        { message: 'Stars', name: 'starred' },
        { message: 'Followers', name: 'followers' },
        { message: 'Following', name: 'following' }
      ]
    }
  },
  computed: {
    starsResult () {
      let userOneStarred = this.userOneStarred
      let userTwoStarred = this.userTwoStarred
      let mutualStarred = this.mutualStarred
      let starList = [], finalStarList=[], searchedRepos=[], obj
      if (this.leftSetPortion) {
        obj = { 'arr': userOneStarred, 'key': 'left' }
        starList.push(obj)
      }
      if (this.rightSetPortion) {
        obj = { 'arr': userTwoStarred, 'key': 'right' }
        starList.push(obj)
      }
      if (this.intersectionPortion) {
        obj = { 'arr': mutualStarred, 'key': 'center' }
        starList.push(obj)
      }

      if (this.leftSetPortion === false) {
        if (starList.map(val => val.key).indexOf('left') !== -1)
          starList.splice(starList.map(val => val.key).indexOf('left'), 1)
      }
      if (this.rightSetPortion === false) {
        if (starList.map(val => val.key).indexOf('right') !== -1)
          starList.splice(starList.map(val => val.key).indexOf('right'), 1)
      }
      if (this.intersectionPortion === false) {
        if (starList.map(val => val.key).indexOf('center') !== -1)
          starList.splice(starList.map(val => val.key).indexOf('center'), 1)
      }
      for (let i in starList) {
        finalStarList.push(starList[i].arr)
      }

      let result = Array.prototype.concat.apply([], finalStarList)
      if (this.sortRepos !== 'Default') {
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
                       .on('click', this.selectCircle)
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
      .style('fill', '#239a3b').on('click', this.selectIntersection)
  },
  methods: {
    tabSelect (index) {
      this.tabSelectionIndex = index
    },
    selectSort (sort) {
      this.sortRepos = sort
      this.searchRepos = ''
    },
    selectLang (lang) {
      this.selectedLanguage = lang
      this.searchRepos = ''
    },
    circleSelection (d, setPortion, setFillColor) {
      if (d.cx == 300) {
        this.leftSetPortion = setPortion
      } else {
        this.rightSetPortion = setPortion
      }
      d3.select('#'+d.id).style('fill', setFillColor)
    },
    selectCircle (d) {
      // rgb(35, 154, 59)
      let isCircleSelected = (d3.select('#'+d.id).style('fill') == 'rgb(123, 201, 111)')
      let setPortion = isCircleSelected ? true : false
      let setFillColor = isCircleSelected ? '#239a3b' : '#7bc96f'
      this.circleSelection(d, setPortion, setFillColor)
      this.uniqueLanguages = []
      this.selectedLanguage = ''
      this.searchRepos = ''
    },
    selectIntersection (d) {
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
    fetchReposStarred (msg, event) {
      let userOne, userTwo
      userOne = (this.inputone.split('/').length > 2) ? this.inputone.split('/')[3] : this.inputone
      userTwo = (this.inputtwo.split('/').length > 2) ? this.inputtwo.split('/')[3] : this.inputtwo

      let userDetails = []
      userDetails[0] = (userOne.length > 9) ? userOne.slice(0, 7).concat('..') : userOne
      userDetails[1] = (userTwo.length > 9) ? userTwo.slice(0, 7).concat('..') : userTwo
      d3.select('#venn').selectAll('text').text(function (d, i) { return userDetails[i] })
      if (userOne !== '' && userTwo !== '') {
        if (this.mutualStarred.length > 0) {
          this.mutualStarred = []
          this.userOneStarred = []
          this.userTwoStarred = []
        }
        this.uniqueLanguages = []
        this.selectedLanguage = ''
        this.searchRepos = ''
        this.showSpinner = true
        this.errorMessageFieldOne = ''
        this.errorMessageFieldTwo = ''
        let countOne = 1
        let countTwo = 1
        // replace below access token with your github access token..

        let userOneStarredRepos = []
        let userTwoStarredRepos = []
        let flagOneFinished = false
        let flagTwoFinished = false
        // use access
        // axios.get('https://api.github.com/users/'+userOne+'/starred?page='+countOne+'&per_page=100', config)
        let getTabValue = this.items[this.tabSelectionIndex]['name']
        const collectUserOnestars = () => {
          Promise.all([
            axios.get('https://api.github.com/users/'+userOne+'/'+getTabValue+'?page='+countOne+'&per_page=100', config)
          ]).then(response => {
            response.forEach((res) => {
              if (res.data.length !== 0) {
                res.data.forEach((result) => {
                  userOneStarredRepos.push(result)
                })
                countOne++
                collectUserOnestars()
              } else {
                flagOneFinished = true
              }
            })
          }).catch(() => {
            this.errorMessageFieldOne = 'User '+userOne+' not found'
          })
        }

        const collectUserTwostars = () => {
          Promise.all([
            axios.get('https://api.github.com/users/'+userTwo+'/'+getTabValue+'?page='+countTwo+'&per_page=100', config)
          ]).then(response => {
            response.forEach((res) => {
              if (res.data.length !== 0) {
                // userOneStarredRepos.push(res.data)
                res.data.forEach((result) => {
                  userTwoStarredRepos.push(result)
                })
                countTwo++
                collectUserTwostars()
              } else {
                flagTwoFinished = true
              }
            })
          }).catch(() => {
            this.errorMessageFieldTwo = 'User '+userTwo+' not found'
          })
        }
        collectUserOnestars()
        collectUserTwostars()

        var isFinished = function () {
          if (flagOneFinished && flagTwoFinished) {
            if (checker) {
              window.clearInterval(checker)
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
                this.mutualStarred.push(star)
              }
            })

            userOneStarredRepos.map((mItem, mIndex) => {
              if (this.mutualStarred.map(val => val.htmlurl).indexOf(mItem.html_url) === -1) {
                let star = {}
                star.name = mItem.name
                star.description = mItem.description
                star.htmlurl = mItem.html_url
                star.gazerscount = mItem.stargazers_count
                star.language = mItem.language
                this.userOneStarred.push(star)
              }
            })
            userTwoStarredRepos.map((mItem, mIndex) => {
              if (this.mutualStarred.map(val => val.htmlurl).indexOf(mItem.html_url) === -1) {
                let star = {}
                star.name = mItem.name
                star.description = mItem.description
                star.htmlurl = mItem.html_url
                star.gazerscount = mItem.stargazers_count
                star.language = mItem.language
                this.userTwoStarred.push(star)
              }
            })
            this.showSpinner = false
          }
        }.bind(this)
        var checker = window.setInterval(isFinished, 300)
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