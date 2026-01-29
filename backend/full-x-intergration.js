{\rtf1\ansi\ansicpg950\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;\f1\fnil\fcharset0 HelveticaNeue-Bold;\f2\fnil\fcharset0 HelveticaNeue;
\f3\fmodern\fcharset0 Courier;}
{\colortbl;\red255\green255\blue255;\red48\green48\blue54;\red236\green236\blue236;\red249\green249\blue249;
}
{\*\expandedcolortbl;;\cssrgb\c24706\c24706\c27451;\cssrgb\c94118\c94118\c94118;\cssrgb\c98039\c98039\c98039;
}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 / backend/full-x-integration.js\
import XApiConfig from './x-api-config';\
\
class FullXIntegration \{\
  constructor() \{\
    this.api = new XApiConfig();\
  \}\
\
  // \uc0\u33719 \u21462 $SPARK\u30456 \u20851 \u25512 \u25991 \
  async getSparkTweets() \{\
    try \{\
      const params = \{\
        query: '$SPARK OR $SPARKToken OR "Spark Token" OR #SPARK',\
        max_results: 20,\
        'tweet.fields': 'created_at,author_id,public_metrics,context_annotations,lang',\
        'user.fields': 'name,username,verified,profile_image_url,public_metrics'\
      \};\
\
      const result = await this.api.makeRequest('/tweets/search/recent', params);\
      return result.data || [];\
    \} catch (error) \{\
      console.error('\uc0\u33719 \u21462 \u25512 \u25991 \u22833 \u36133 :', error);\
      return [];\
    \}\
  \}\
\
  // \uc0\u33719 \u21462 \u29992 \u25143 \u20449 \u24687 \
  async getUserInfo(userId) \{\
    try \{\
      const params = \{\
        'user.fields': 'name,username,verified,profile_image_url,public_metrics'\
      \};\
\
      const result = await this.api.makeRequest(`/users/$\{userId\}`, params);\
      return result.data;\
    \} catch (error) \{\
      console.error('\uc0\u33719 \u21462 \u29992 \u25143 \u20449 \u24687 \u22833 \u36133 :', error);\
      return null;\
    \}\
  \}\
\
  // \uc0\u24773 \u32490 \u20998 \u26512 \
  performSentimentAnalysis(tweets) \{\
    const positiveWords = [\
      'love', 'great', 'amazing', 'good', 'excellent', 'fantastic', 'awesome',\
      'brilliant', 'perfect', 'incredible', 'outstanding', 'wonderful', 'superb',\
      'fabulous', 'marvelous', 'terrific', 'delightful', 'magnificent', 'splendid',\
      'beneficial', 'profitable', 'bullish', 'moon', 'diamond', 'gem', 'winner',\
      'success', 'strong', 'potential', 'growth', 'profit', 'gain', 'up', 'high'\
    ];\
\
    const negativeWords = [\
      'bad', 'terrible', 'awful', 'horrible', 'worst', 'disappointing', 'poor',\
      'useless', 'worthless', 'crap', 'junk', 'trash', 'fail', 'failed', 'failure',\
      'suck', 'hate', 'hated', 'annoying', 'annoyed', 'boring', 'bore', 'scam',\
      'fake', 'fraud', 'shitcoin', 'rugpull', 'dump', 'bearish', 'crash', 'down',\
      'loss', 'low', 'decline', 'fall', 'drop', 'problem', 'issue', 'concern'\
    ];\
\
    let positiveCount = 0;\
    let negativeCount = 0;\
    let neutralCount = 0;\
\
    tweets.forEach(tweet => \{\
      const text = tweet.text.toLowerCase();\
      \
      const hasPositive = positiveWords.some(word => text.includes(word));\
      const hasNegative = negativeWords.some(word => text.includes(word));\
\
      if (hasPositive && !hasNegative) positiveCount++;\
      else if (hasNegative && !hasPositive) negativeCount++;\
      else neutralCount++;\
    \});\
\
    const totalCount = tweets.length;\
    return \{\
      total: totalCount,\
      positive: positiveCount,\
      negative: negativeCount,\
      neutral: neutralCount,\
      positiveRatio: totalCount > 0 ? positiveCount / totalCount : 0,\
      negativeRatio: totalCount > 0 ? negativeCount / totalCount : 0,\
      sentimentScore: totalCount > 0 ? (positiveCount - negativeCount) / totalCount : 0\
    \};\
  \}\
\
  // \uc0\u36235 \u21183 \u20998 \u26512 \
  analyzeTrends(tweets) \{\
    const wordFrequency = \{\};\
    const excludeWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'the', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'rt'];\
\
    tweets.forEach(tweet => \{\
      const words = tweet.text.toLowerCase()\
        .replace(/[^\\w\\s]/g, ' ')\
        .split(/\\s+/)\
        .filter(word => word.length > 2 && !excludeWords.includes(word));\
\
      words.forEach(word => \{\
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;\
      \});\
    \});\
\
    const sortedWords = Object.entries(wordFrequency)\
      .sort(([,a], [,b]) => b - a)\
      .slice(0, 10);\
\
    return \{\
      topWords: sortedWords,\
      tweetVolume: tweets.length\
    \};\
  \}\
\
  // \uc0\u26684 \u24335 \u21270 \u25512 \u25991 \u29992 \u20110 \u26174 \u31034 \
  formatTweetForDisplay(tweet, user) \{\
    return \{\
      id: tweet.id,\
      text: tweet.text,\
      createdAt: tweet.created_at,\
      language: tweet.lang || 'unknown',\
      author: \{\
        username: user?.username || 'unknown',\
        name: user?.name || 'Unknown User',\
        verified: user?.verified || false,\
        profileImage: user?.profile_image_url || '',\
        followers: user?.public_metrics?.followers_count || 0\
      \},\
      metrics: \{\
        likes: tweet.public_metrics?.like_count || 0,\
        retweets: tweet.public_metrics?.retweet_count || 0,\
        replies: tweet.public_metrics?.reply_count || 0,\
        quotes: tweet.public_metrics?.quote_count || 0\
      \},\
      url: `https://x.com/$\{user?.username || 'i'\}/status/$\{tweet.id\}`,\
      annotations: tweet.context_annotations || []\
    \};\
  \}\
\}\
\
export default FullXIntegration;\
\pard\pardeftab720\partightenfactor0

\f1\b\fs28 \cf2 \cb4 backend/optimized-x-integration-vercel.js
\f2\b0 \
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 // backend/optimized-x-integration-vercel.js\
import FullXIntegration from './full-x-integration';\
import \{ getCachedData, setCachedData \} from '../lib/cache';\
\
class OptimizedXIntegrationVercel extends FullXIntegration \{\
  constructor() \{\
    super();\
    this.searchQueries = [\
      '$SPARK', \
      '$SPARKToken', \
      '"Spark Token"', \
      '#SPARK', \
      'SparkTokenX'\
    ];\
  \}\
\
  async getCachedData(key) \{\
    return await getCachedData(key);\
  \}\
\
  async setCachedData(key, data) \{\
    await setCachedData(key, data);\
  \}\
\
  // \uc0\u20248 \u21270 \u30340 \u25512 \u25991 \u25628 \u32034 \
  async getOptimizedSparkTweets() \{\
    const allTweets = [];\
    \
    for (const query of this.searchQueries) \{\
      try \{\
        const tweets = await this.api.makeRequest('/tweets/search/recent', \{\
          query: query,\
          max_results: 10,\
          'tweet.fields': 'created_at,author_id,public_metrics,context_annotations,lang',\
          'user.fields': 'name,username,verified,profile_image_url,public_metrics'\
        \});\
        \
        if (tweets.data) \{\
          allTweets.push(...tweets.data);\
        \}\
      \} catch (error) \{\
        console.error(`\uc0\u25628 \u32034 \u26597 \u35810  "$\{query\}" \u26102 \u20986 \u38169 :`, error);\
      \}\
    \}\
    \
    // \uc0\u21435 \u37325 \u24182 \u25353 \u26102 \u38388 \u25490 \u24207 \
    const uniqueTweets = this.dedupeTweets(allTweets);\
    return uniqueTweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 30);\
  \}\
\
  // \uc0\u21435 \u38500 \u37325 \u22797 \u25512 \u25991 \
  dedupeTweets(tweets) \{\
    const seenIds = new Set();\
    return tweets.filter(tweet => \{\
      if (seenIds.has(tweet.id)) \{\
        return false;\
      \}\
      seenIds.add(tweet.id);\
      return true;\
    \});\
  \}\
\
  // \uc0\u33719 \u21462 \u20248 \u21270 \u30340 \u25968 \u25454 \
  async getOptimizedData() \{\
    console.log('\uc0\u33719 \u21462 \u20248 \u21270 \u30340 $SPARK\u25512 \u25991 \u25968 \u25454 ...');\
    \
    const tweets = await this.getOptimizedSparkTweets();\
    const formattedTweets = [];\
    \
    // \uc0\u33719 \u21462 \u29992 \u25143 \u20449 \u24687 \u24182 \u26684 \u24335 \u21270 \u25512 \u25991 \
    for (const tweet of tweets) \{\
      try \{\
        const user = await this.getUserInfo(tweet.author_id);\
        formattedTweets.push(this.formatTweetForDisplay(tweet, user));\
      \} catch (error) \{\
        // \uc0\u22914 \u26524 \u33719 \u21462 \u29992 \u25143 \u20449 \u24687 \u22833 \u36133 \u65292 \u20173 \u28982 \u26174 \u31034 \u25512 \u25991 \
        formattedTweets.push(this.formatTweetForDisplay(tweet));\
        console.error(`\uc0\u33719 \u21462 \u29992 \u25143 \u20449 \u24687 \u22833 \u36133  $\{tweet.author_id\}:`, error);\
      \}\
    \}\
    \
    // \uc0\u20998 \u26512 \u25968 \u25454 \
    const analysis = this.performEnhancedAnalysis(formattedTweets);\
    \
    return \{\
      tweets: formattedTweets,\
      analytics: \{\
        totalTweets: formattedTweets.length,\
        ...analysis\
      \}\
    \};\
  \}\
\
  // \uc0\u22686 \u24378 \u30340 \u25968 \u25454 \u20998 \u26512 \
  performEnhancedAnalysis(tweets) \{\
    // \uc0\u24773 \u32490 \u20998 \u26512 \
    const sentiment = this.performSentimentAnalysis(tweets.map(t => (\{text: t.text\})));\
    \
    // \uc0\u35821 \u35328 \u20998 \u24067 \
    const languageDistribution = this.analyzeLanguageDistribution(tweets);\
    \
    // \uc0\u27963 \u36291 \u26102 \u38388 \u27573 \
    const activeHours = this.analyzeActiveHours(tweets);\
    \
    // \uc0\u39640 \u24433 \u21709 \u21147 \u36134 \u25143 \
    const influentialAccounts = this.findInfluentialAccounts(tweets);\
    \
    return \{\
      sentiment,\
      languageDistribution,\
      activeHours,\
      influentialAccounts,\
      engagementRate: this.calculateEngagementRate(tweets)\
    \};\
  \}\
\
  // \uc0\u35821 \u35328 \u20998 \u24067 \u20998 \u26512 \
  analyzeLanguageDistribution(tweets) \{\
    const distribution = \{\};\
    tweets.forEach(tweet => \{\
      const lang = tweet.language;\
      distribution[lang] = (distribution[lang] || 0) + 1;\
    \});\
    return distribution;\
  \}\
\
  // \uc0\u27963 \u36291 \u26102 \u38388 \u27573 \u20998 \u26512 \
  analyzeActiveHours(tweets) \{\
    const hours = Array(24).fill(0);\
    tweets.forEach(tweet => \{\
      const hour = new Date(tweet.createdAt).getUTCHours();\
      hours[hour]++;\
    \});\
    return hours;\
  \}\
\
  // \uc0\u26597 \u25214 \u39640 \u24433 \u21709 \u21147 \u36134 \u25143 \
  findInfluentialAccounts(tweets) \{\
    const accountMetrics = \{\};\
    \
    tweets.forEach(tweet => \{\
      const account = tweet.author.username;\
      if (!accountMetrics[account]) \{\
        accountMetrics[account] = \{\
          username: account,\
          name: tweet.author.name,\
          verified: tweet.author.verified,\
          totalEngagement: 0,\
          tweetCount: 0\
        \};\
      \}\
      \
      accountMetrics[account].totalEngagement += \
        tweet.metrics.likes + tweet.metrics.retweets + tweet.metrics.replies;\
      accountMetrics[account].tweetCount++;\
    \});\
    \
    return Object.values(accountMetrics)\
      .sort((a, b) => b.totalEngagement - a.totalEngagement)\
      .slice(0, 10);\
  \}\
\
  // \uc0\u35745 \u31639 \u24179 \u22343 \u20114 \u21160 \u29575 \
  calculateEngagementRate(tweets) \{\
    if (tweets.length === 0) return 0;\
    \
    const totalEngagement = tweets.reduce((sum, tweet) => \
      sum + tweet.metrics.likes + tweet.metrics.retweets + tweet.metrics.replies, 0);\
    \
    return totalEngagement / tweets.length;\
  \}\
\}\
\
export default OptimizedXIntegrationVercel;
\f3\fs28 \
}