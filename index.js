const PORT = process.env.PORT || 3000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", function (req, res) {
  res.json("An Internship Web Scraper built for MLH Orientation Hackathon");
});

app.get("/results/:role?", (req, res) => {
  const promises = [];

  for (let pageNumber = 0; pageNumber <= 325; pageNumber += 25) {
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=internship%20${req.params.role}&location=Worldwide&geoId=92000000&trk=public_jobs_jobs-search-bar_search-submit&currentJobId=2931031787&position=1&pageNum=0&start=${pageNumber}`;
    promises.push(
      axios(url)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const jobs = $("li");
          const internships = [];

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
            const logo = $(element)
              .find("img.artdeco-entity-image ")
              .attr("data-delayed-url");
            const datePosted = $(element)
              .find(".job-search-card__listdate")
              .text()
              .trim();

            internships.push({
              title,
              company,
              location,
              link,
              logo,
              datePosted,
            });
          });

          return internships;
        })
        .catch((err) => console.log(err.message))
    );
  }

  Promise.all(promises).then((result) => {
    let arr = [];
    for (let i = 0; i < result.length; i++) {
      arr.push(...result[i]);
    }
    return res.json(arr);
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
