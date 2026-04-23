/**
 * Searches Google News via free RSS for current events related to a supply chain segment
 * @param {string} from - Source location
 * @param {string} to - Destination location
 * @param {string} mode - Transport mode
 * @returns {Promise<string>} Summary of current news headlines
 */
async function getRealTimeContext(from, to, mode) {
  // Use a targeted query focusing on supply chain, logistics, and potential disruptions
  const query = encodeURIComponent(`${from} to ${to} ${mode} transport OR supply chain OR logistics OR port OR strike OR disruption`);
  
  try {
    // We use the completely free Google News RSS feed. 
    // No API keys required, no rate limits for normal hackathon use!
    const res = await fetch(`https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`);
    const xml = await res.text();

    // Extract headlines and publication dates using simple regex
    // The first <title> is the feed title ("Google News"), so we skip it.
    const itemRegex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/g;
    const matches = [...xml.matchAll(itemRegex)].slice(0, 4); // Get top 4 results

    if (matches.length === 0) {
      return `No significant recent disruptions found in the news for ${mode} transport from ${from} to ${to}.`;
    }

    const headlines = matches.map((m, index) => {
      // Clean up the title (sometimes has HTML entities)
      const title = m[1].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const date = new Date(m[2]).toDateString();
      return `${index + 1}. [${date}] ${title}`;
    }).join('\n');

    return `Recent real-world news affecting this segment:\n${headlines}`;

  } catch (error) {
    console.error('Search RSS Error:', error.message);
    return `(Real-time data fetch failed for this segment: ${error.message})`;
  }
}

module.exports = { getRealTimeContext };
