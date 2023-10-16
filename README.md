
### Local Development

```
bundle init
bundle add jekyll
bundle exec jekyll new --force --skip-bundle .
bundle install
bundle exec jekyll serve --livereload
```

Once you have it up and running, you can boot up the local sever with a bash script I made because I never remember that bundle start command

```
./start.sh
```


- Site is built with [Github Pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- Pushing to main branch will automatically update the live site!


## Changes


`2022-05-30` &nbsp; &nbsp; added cors config to gs bucket  
`2023-10-16` &nbsp; &nbsp; adding waitlist