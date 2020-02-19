const puppeteer = require('puppeteer');
const helpers = require('./helpers');
const toCSV = helpers.toCSV;
const splitDateRange = helpers.splitDateRange;
const autoScroll = helpers.autoScroll;
const scrollPageToBottom = require("puppeteer-autoscroll-down");
/*
 * Function that scrapes all the tweets from a single twitter advanced search and returns them
 * @input query: The search query
 * @input startDate: Starting date in the format "YYYY-MM-DD"
 * @input endDate: Ending date in the format "YYYY-MM-DD"
 *
 * @return: An array of Tweet objects that contain tweet text, id, timestamp, date, likes, retweets
 */
async function run(query, startDate, endDate, chunks) {
    // hold results to output to csv
    let ret = [];

    // make sure we encode the query correctly for URLs
    let encodedQuery = encodeURIComponent(query); // doesnt!

    //chunk the dates
    let dateChunks = splitDateRange(startDate, endDate, chunks);

    //hold the urls to parse
    let urls = [];
    for (var i = 0; i < dateChunks.length; i += 1) {
        //put the search parameters into the search url
        urls.push(`https://twitter.com/search?q=${encodedQuery}%20since%3A${dateChunks[i].start}%20until%3A${dateChunks[i].end}&src=typd&lang=en`);
    }

    const iphone6UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36";

    const username = 'USER'
    const password = 'PASSWORD'

    //make and launch a new page
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false
    });

    let page = await browser.newPage();
    await page.setUserAgent(iphone6UserAgent);

    // open twitter
    await page.goto('https://twitter.com/login', { waitUntil: 'networkidle2' });

    /*
    // Login
    const usernameSelector = 'input[name*="session[username_or_email]"]';
    const passwordSelector = 'input[name*="session[password]"]';

    await page.type(usernameSelector, username, {delay: 100}); // Types slower, like a user
    await page.type(passwordSelector, password, {delay: 100}); // Types slower, like a user

    console.log("Trying to login...");

    // [javascript - Pressing Enter button in puppeteer - Stack Overflow](https://stackoverflow.com/questions/46442253/pressing-enter-button-in-puppeteer)
    await Promise.all([
        page.waitForNavigation(),
        page.type(passwordSelector, String.fromCharCode(13))
    ]);

    // wait till page load
    await page.waitForNavigation()
    */

    for (i = 0; i < urls.length; i += 1) {        

        console.log("Starting scraping on " + urls[i]);
        //goto the twitter search page
        // await page.goto(urls[i]);
        await page.goto(urls[i], { waitUntil: 'networkidle2' });
        
        await page.waitFor(1000*10);

        //set viewport for the autoscroll function
        await page.setViewport({
            width: 1200,
            height: 800
        });


        await page.waitFor(1000*10);

        //scroll until twitter is done lazy loading
        
        let counter = 0;
        while (counter <= 30) {
            console.log("Going to scroll to bottom thirty times ...");

            counter++;
            const lastPosition = await scrollPageToBottom(page, 1000*counter, 200)
            console.log(`lastPosition: ${lastPosition}`)
        }        

        //scrape the tweets
        const tweets = await page.evaluate(function() {
            //constant selector for the actual tweets on the screen
            const TWEET_SELECTOR = 'a[href*="status"]';

            //grab the DOM elements for the tweets
            let elements = Array.from(document.querySelectorAll(TWEET_SELECTOR));
            console.log(elements);

            //create an array to return
            let ret = [];

            //get the info from within the tweet DOM elements
            for (var i = 0; i < elements.length; i += 1) {
                //object to store data
                let tweet = {};

                //get tweet id
                const TWEET_ID_SELECTOR = 'href';
                tweet.id = elements[i].getAttribute(TWEET_ID_SELECTOR);

                //add tweet data to return array
                ret.push(tweet);
            }        

            return ret;
        });

        //add to csv
        ret.push(tweets);

        console.log(ret);

        // await page.waitFor(1000*1000);

        //close the page
        // await page.close();
    }

    //exit the browser
    await browser.close();

    // collapse into one array and return
    return [].concat.apply([], ret);
}

module.exports.run = run;