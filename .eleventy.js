module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("excerptHeader", (article) =>
    excerptHeader(article)
  );
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
    console.log("IT IS A STRING WOOOOOAAHH");
  } else if (article.hasOwnProperty("templateContent")) {
    content = article.templateContent;
    console.log("IT IS A OBJECT WOAHAASDUIASHDUAHSDHUU");
    console.log("content is THISSSSS: ", content);
  }

  if (content === null) {
    console.warn("Error: Unable to extract article template content");
    return null;
  }

  separatorsList.some((separators) => {
    console.log("SEPERATORS.START IS", separators.start);
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      console.log("RUNNING BOIIII");
      excerpt = content
        .substring(startPosition + separators.start.length, endPosition)
        .trim();
      console.log("THE VAL OF EXCERPT HAS BEEN SET TO ", excerpt);
      return true; // Exit out of array loop on first match
    }
  });

  return excerpt;
}

function excerptHeader(article) {
  return excerptHelper(article, makeExcerptSeparator("Heading"));
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
