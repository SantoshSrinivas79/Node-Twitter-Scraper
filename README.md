# Node-Twitter-Scraper
Scraping twitter using Puppeteer and Node

This is a work in progress.

Make sure you enter the email address and password for your email in the helpers.js file 

# Running the package
```bash
npm install
```
to install all dependencies. Then connect to your mongo server and `npm start` to run everything.


```sh
http post http://localhost:3000/scrape term="#tidytuesday" startDate="2020-02-16" endDate="2020-02-19" chunks='day'

```


### Extracting tweet data

```js
var links = document.querySelectorAll('a[href*="status"]');

var links = Array.from(links);

for (i = 0; i < links.length; i++) {
   console.log( );
}
```

```sh
/philmassicotte/status/1229174157201563650
/philmassicotte/status/1229174157201563650/photo/1
/philmassicotte/status/1229174157201563650
/EvaMurzyn/status/1229050026313371649
/EvaMurzyn/status/1229050026313371649/photo/1
/EvaMurzyn/status/1229050026313371649/photo/2
/EvaMurzyn/status/1229050026313371649/photo/3
/justynapawlata/status/1229169440526413829
/justynapawlata/status/1229169440526413829/photo/1
/justynapawlata/status/1229169440526413829
/RLadiesMelb/status/1228843278319046656
/EdudinGonzalo/status/1229176749373693952
/EdudinGonzalo/status/1229176749373693952/photo/1
/RLadiesKhartoum/status/1229110318560755712
/thomas_mock/status/1229042993077813255
/thomas_mock/status/1229042993077813255/photo/1
```

```sh
curl 'https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2Fphilmassicotte%2Fstatus%2F1229174157201563650'

```

```r
t(lookup_statuses('1229169440526413829'))
```

### HACKS

Twitter markup seems to have changed. So, I decided to hack the status codes and use either python or R to get the tweet info
