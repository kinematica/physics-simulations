# Physics Simulations

For now, just start by installing Konva. Navigate to whatever folder you 
cloned this into and type:

```
bower install konva
```

If you don't have Bower (a popular JavaScript package manager) installed yet, 
use NPM (Node Package Manager) to install it:

```
npm install -g bower
```

...where the `-g` option specifies that you'd like Bower to be 'globally' 
available. *If you don't have Node/npm installed*, 
[download it at nodejs.org](http://nodejs.org).

These are toy simulations meant as practice for public outreach. Hopefully 
this will be interesting/intuitive/instructional to someone.

## Useful git commands

* `git clone <url> <directory name>`
* `git status` Lists changes, including "staged" changes
* `git add <file>` Stages a file
* `git mv <file>` Rename a file
* `git rm`
* `git commit -m "did stuff"` Save your changes
* `git push origin master` Push your latest commit to the origin (github)
* `git pull origin master` Get the latest changes from github
* `git stash` Hide your changes for a moment, resets the working directory
* `git stash pop` Get your changes back
* `git remote add <name> <url>` Add a new remote repository
* `rm -rf <git directory>` Delete a git working directory without complaints

## Modularity of Visual Style

Modularity is good. Uniform style is good. Here is a list of frequently used 
objects and primitive shapes that can and should be made modular.

- [ ] photons (as seen in the special relativity demo)
- [ ] colours (the general colour palette for lines, etc; this way we can 
    eventually do nifty things like using themes without too much trouble)
- [ ] stroke-widths (same idea as above)

There's likely a good way to use css with this, which we should figure out.
