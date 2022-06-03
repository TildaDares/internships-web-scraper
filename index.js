const PORT = process.env.PORT || 3000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();

app.get("/", function (req, res) {
  res.json("An Internship Web Scraper built for MLH Orientation Hackathon");
});

app.get("/results", (req, res) => {
  const internships = [];

  for (let pageNumber = 0; pageNumber < 1000; pageNumber += 25) {
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=internship&location=Worldwide&&trk=public_jobs_jobs-search-bar_search-submit&currentJobId=2931031787&position=1&pageNum=0&start=${pageNumber}`;

    axios(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const jobs = $("li");

        jobs.each((index, element) => {
          const title = $(element)
            .find("h3.base-search-card__title")
            .text()
            .trim();
          const company = $(element)
            .find("h4.base-search-card__subtitle")
            .text()
            .trim();

          const location = $(element)
            .find("span.job-search-card__location")
            .text()
            .trim();

          const link = $(element).find("a.base-card__full-link").attr("href");

          internships.push({
            title,
            company,
            location,
            link,
          });
        });

        res.json(internships);
      })
      .catch((err) => console.log(err));
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
