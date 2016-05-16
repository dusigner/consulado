# Consul VTEX
This is the main repository Consul VTEX Cloud E-Commerce platform , follow these next steps to contribute to the project !

## That i need to know ?

- [Html 5](https://developer.mozilla.org/pt-BR/docs/Web/HTML/HTML5) - For Structure
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) - For Life
- [CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS) - For Life
- [Node.js](https://nodejs.org/en/) - For Everything
- [Ruby 2.0.0](https://www.ruby-lang.org/pt/downloads/) - Only for Sass lol
- [Sass](http://sass-lang.com/) - For Style
- [Gulp](http://gulpjs.com/) - For task Runner
- [Fiddler](https://www.telerik.com/download/fiddler) - For Proxy
- [Charles Proxy](https://www.charlesproxy.com/) - Alternative to fiddler


## Setting up the git repository

* Clone the Git Repository <br />
Run the `git clone` command in the desired location of your computer.

* Install all **node modules** packages <br />
Run `npm install`  or `npm i` in the local path. <br />
This will bring all the packages that you need.


## Running the project with Gulp

Now that all the packages are installed. <br />
You need to run the project, right?

**Gulp** will make your life such easy!

* Running in the default environment. <br />
Run `gulp`

Gulp will automatic open on:
```
localhost:3000
```
* Running in another vtex environment. <br />
Run `gulp --account=consulqa` <br />
The consulqa is the environment that gulp will run, so the value of "--account" is the package accountName that change in gulpfile.js.

* Running gulp pages <br />
Soon ... in the next episode

## Deploy

* For generate the **build** files <br />
Run `gulp --production` <br />
This will generate the build files and change the version of package.json

* For not change the version of package.json <br />
Run `gulp --production --nobump`
