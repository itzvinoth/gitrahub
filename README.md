# Gitrahub

> A Github based project. `Gitrahub` stands for 'Git Intra Hub'. Main goal of gitrahub is you can easily find the sharred interest between two users. Follow the below steps and run it locally. 



## Demo

![Live Demo](https://i.imgur.com/95xE6Pr.gif)

## How it works

You can either provide github profile url or username in the respective input fields like in the below image. In this case i gave profile url to the first input field and profile name to the second input field.

# ![input field](gitra-1.png)

So after clicking the `Get starred repos` button you will get the mutual starred repos of the two users.

# ![input field](gitra-2.png)

Incase you want to find the individual starred repos of particular user you can select areas in the venn diagram like below images. So Let's start play with gitrahub.

# ![input field](gitra-3.png)
# ![input field](gitra-4.png)

## Some Constraints 

GitHub limits unauthenticated API requests to 60 per hour but after binding your access token you will be able to enjoy the rate limit of 5,000 requests per hour.

How should I bind my access token?

Go to `Gitrahub.vue` file find this lines. 
```javascript
// replace below sample access token with your own github access token.
let config = {
   headers: {'Authorization': 'token 5f55b5000330c1a56e328efe84gh4b6499b8219b'}
}
// use these lines 
  axios.get('https://api.github.com/users/'+userOne+'/starred?page='+countOne+'&per_page=100', config)
  axios.get('https://api.github.com/users/'+userTwo+'/starred?page='+countTwo+'&per_page=100', config)
  
// instead of these  
  axios.get('https://api.github.com/users/'+userOne+'/starred?page='+countOne+'&per_page=100')
  axios.get('https://api.github.com/users/'+userTwo+'/starred?page='+countTwo+'&per_page=100')
```

## Installation

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Credits

R. Vivek ([@vividvilla](https://github.com/vividvilla))
