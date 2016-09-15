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


## Starting new task

* Create a new branch: <br />
In the 'master' branch run `git checkout -b "<branch name>"`.


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

* Generate minificated files without the need to deploy: <br />
Run `gulp --production`

* Running gulp pages <br />
Soon ... in the next episode


## Ending a task

* Add the changes in branch: <br />
Run `git add <file>` to add a specific file. <br />
Or run `git add --all` or `git add .` to add all changed files. <br />

* Commit the changes: <br />
Run `git commit -m "<ignored text> <ISSUE_KEY> <ignored text> #<COMMAND> <optional COMMAND_ARGUMENTS>"` to commit the changes in the branch and send to Jira, where: <br />
 * ISSUE_KEY: Task ID in Jira that will be referenced;
 * COMMAND: They are divided into three commands:
  * comment: to add a comment in Jira;
  * time: time workd in task;
  * transition: task status transition. <br />

Example: `git commit -m "PLAT-123 #comment Correção da tarefa 123 #time 2h 30m #Done"`.

* Push the branch: <br />
Run `git push origin <branch name>"` to push the branch to repository. <br />

* Merge with stage: <br />
Run `git checkout stage` to go to the 'stage' branch. <br />
Run `git pull` to get all the changes of branch 'stage' directly from the repository. <br />
Run `git merge <branch name>` to merge stage with changes in branch <branch name>. <br/>
Run `git push` to push the changes in branch to repository.

* Tagging changes: <br />
[Optional] In Git Bash or Linux shell run `git tag | xargs git tag -d` to delete all local tags. <br />
[Optional] Or in Windows Power Shell run `git tag | foreach-object -process { git tag -d $_ }` to delete all local tags. <br />
[Optional] Or in Command Prompt run `FOR /f "tokens=*" %a in ('git tag') DO git tag -d %a` to delete all local tags. <br />
Run `git fetch --tags` to get all tags in repository. <br />
Run `git tag` to list all tags. <br />
Run `git tag -a <tag version> -m "<comment>"` to create a new tag. <br />
Run `git push origin <tag version>` to push the tag to repository.



## Deploy

* [Optional] For delete local tags: <br />
In Git Bash or Linux shell run `git tag | xargs git tag -d`.<br />
In Windows Power Shell run `git tag | foreach-object -process { git tag -d $_ }`.<br />
In Command Prompt run `FOR /f "tokens=*" %a in ('git tag') DO git tag -d %a`.<br />

* For generate the **build** files: <br />
Run `gulp deploy`. <br />
Add your Git login and password to get the last tag in Git. <br />
This will generate the build files and change the version of package.json for the last tag Git. <br />
Run `git push` to push the changes in branch to repository.

* For not change the version of package.json <br />
Run `gulp deploy --nobump`
