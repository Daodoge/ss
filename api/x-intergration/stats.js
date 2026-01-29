{\rtf1\ansi\ansicpg950\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;\f1\fmodern\fcharset0 Courier;}
{\colortbl;\red255\green255\blue255;\red48\green48\blue54;\red236\green236\blue236;}
{\*\expandedcolortbl;;\cssrgb\c24706\c24706\c27451;\cssrgb\c94118\c94118\c94118;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 // api/x-integration/stats.js\
import OptimizedXIntegrationVercel from '../../backend/optimized-x-integration-vercel';\
\
export default async function handler(req, res) \{\
  // \uc0\u35774 \u32622  CORS \u22836 \u37096 \
  res.setHeader('Access-Control-Allow-Origin', '*');\
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');\
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');\
\
  // \uc0\u22788 \u29702 \u39044 \u26816 \u35831 \u27714 \
  if (req.method === 'OPTIONS') \{\
    return res.status(200).end();\
  \}\
\
  if (req.method !== 'GET') \{\
    return res.status(405).json(\{ error: 'Method not allowed' \});\
  \}\
\
  try \{\
    const xIntegration = new OptimizedXIntegrationVercel();\
    \
    const cacheKey = 'spark_stats';\
    let stats = await xIntegration.getCachedData(cacheKey);\
    \
    if (!stats) \{\
      const data = await xIntegration.getOptimizedData();\
      stats = \{\
        totalTweets: data.analytics.totalTweets,\
        sentimentScore: data.analytics.sentiment.sentimentScore,\
        topLanguage: Object.keys(data.analytics.languageDistribution)[0],\
        peakHour: data.analytics.activeHours.indexOf(Math.max(...data.analytics.activeHours)),\
        influentialAccounts: data.analytics.influentialAccounts.slice(0, 5),\
        avgEngagement: data.analytics.engagementRate,\
        updatedAt: new Date().toISOString()\
      \};\
      \
      await xIntegration.setCachedData(cacheKey, stats);\
    \}\
    \
    // \uc0\u35774 \u32622 \u32531 \u23384 \u22836 \u37096 \
    res.setHeader('Cache-Control', 's-maxage=180'); // 3\uc0\u20998 \u38047 \u32531 \u23384 \
    \
    res.status(200).json(stats);\
  \} catch (error) \{\
    console.error('\uc0\u32479 \u35745 API\u38169 \u35823 :', error);\
    res.status(500).json(\{ error: '\uc0\u33719 \u21462 \u32479 \u35745 \u25968 \u25454 \u22833 \u36133 ' \});\
  \}\
\}
\f1\fs28 \
}