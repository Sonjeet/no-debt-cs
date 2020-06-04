const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("excerptHeader", (article) =>
    excerptHeader(article)
  );

  eleventyConfig.addShortcode("excerptRationale", (article) =>
    excerptRationale(article)
  );

  eleventyConfig.addShortcode("excerptFurtherInfo", (article) =>
    excerptFurtherInfo(article)
  );

  eleventyConfig.addShortcode("excerptCredits", (article) =>
    excerptCredits(article)
  );

  eleventyConfig.addShortcode("excerptResources", (article) =>
    excerptResources(article)
  );

  eleventyConfig.addShortcode("excerptBooks", (article) =>
    excerptBooks(article)
  );

  eleventyConfig.addShortcode("excerptChecklist", (article) =>
    excerptChecklist(article)
  );

  eleventyConfig.addPassthroughCopy("icons");

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
};

/**
 *
 * @param {string | object} article - either a string of content from a .md file
 *  or it will contain an object with a templateContent field which is automagically provided by 11ty
 * @param {object} separatorsList - array of objects with the following structure
 *  theses denote what the flags for the start and end of an excerpt should be
 *  for more info, the algorithm is inspired from: https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/
 *  {
 *    start: string;
 *    end: string;
 *  }
 * @return {string | null} .md excerpt is returned on success, null is returned on a failure
 */
function excerptHelper(article, separatorsList) {
  let content = null;
  let excerpt = null;

  if (typeof article === "string") {
    content = article;
  } else if (article.hasOwnProperty("templateContent")) {
    content = article.templateContent;
  }

  if (content === null) {
    console.warn("Error: Unable to extract article template content");
    return null;
  }

  separatorsList.some((separators) => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content
        .substring(startPosition + separators.start.length, endPosition)
        .trim();
      return true; // Exit out of array loop on first match
    }
  });

  return excerpt;
}

function excerptHeader(article) {
  return excerptHelper(article, makeExcerptSeparator("Heading"));
}

function excerptRationale(article) {
  return excerptHelper(article, makeExcerptSeparator("Rationale"));
}

function excerptFurtherInfo(article) {
  return excerptHelper(article, makeExcerptSeparator("FurtherInfo"));
}

function excerptCredits(article) {
  return excerptHelper(article, makeExcerptSeparator("Credits"));
}

function excerptResources(article) {
  return excerptHelper(article, makeExcerptSeparator("Resources"));
}

function excerptBooks(article) {
  return excerptHelper(article, makeExcerptSeparator("RecommendedBooks"));
}

function excerptChecklist(article) {
  return excerptHelper(article, makeExcerptSeparator("Checklist"));
}

function makeExcerptSeparator(separator) {
  return [
    {
      start: `<!-- Start ${separator} -->`,
      end: `<!-- End ${separator} -->`,
    },
    {
      start: "<p>",
      end: "</p>",
    },
  ];
}
