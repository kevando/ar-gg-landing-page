
**AR.GG** 


landing-page-v1



# Redirects

> You can do this from the github.com web interface


Create new file `_redirects/example/md`

```
---
layout: redirect
permalink: /example
title: Example Title
description: Example Description
redirect_url: https://www.example.com
preview_image: /assets/example.png
mixpanel_eventname: Example
---
```

# 3D Models

> You can do this from the github.com web interface


Add a markdown file. in the top click **add file**  `>` **create new file** name your file something like: `invite-for-new-kids.md` with content like this:


```
---
layout: model-viewer
permalink: /kids
title: New Kids on the Block
button_text: claim (4 left)
loading_text: Loook who's walkin up...
model_url: /assets/street_corner.glb
discord_url: https://discord.gg/hUYwd6sJ
---
```

Click Commit. *Your new url is now live!* Check and make sure. argg.gg/kids should render, but without a model. Lets fix that.

you can use a local url or an external link. types other than glb should work but haven't been tested. If you choose internal (link in the example) you now have to upload it here the same way you created this markdown file, except do it in the assets directory.

[assets](https://github.com/kevando/ar-gg-landing-page/tree/main/assets) > add file > upload files (choose your model) Commit Changes

--


# Running Site Locally

Install Ruby and bundle. Site is built with [Github Pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)

```
bundle init
bundle add jekyll
bundle exec jekyll new --force --skip-bundle .
bundle install
bundle exec jekyll serve --livereload
```

Pushing to main branch updates live site 🙂


