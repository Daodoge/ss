{\rtf1\ansi\ansicpg950\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;\f1\fmodern\fcharset0 Courier;}
{\colortbl;\red255\green255\blue255;\red48\green48\blue54;\red236\green236\blue236;}
{\*\expandedcolortbl;;\cssrgb\c24706\c24706\c27451;\cssrgb\c94118\c94118\c94118;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 // lib/cache.js\
// Vercel\uc0\u29615 \u22659 \u19979 \u30340 \u31616 \u21333 \u32531 \u23384 \u23454 \u29616 \
let cache = \{\};\
\
export async function getCachedData(key) \{\
  const cachedItem = cache[key];\
  \
  if (cachedItem && Date.now() - cachedItem.timestamp < cachedItem.expiry) \{\
    return cachedItem.data;\
  \}\
  \
  return null;\
\}\
\
export async function setCachedData(key, data, expiry = 3 * 60 * 1000) \{ // \uc0\u40664 \u35748 3\u20998 \u38047 \
  cache[key] = \{\
    data,\
    timestamp: Date.now(),\
    expiry\
  \};\
\}
\f1\fs28 \
}