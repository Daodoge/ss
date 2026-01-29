{\rtf1\ansi\ansicpg950\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;\f1\fswiss\fcharset0 Helvetica;\f2\fmodern\fcharset0 Courier;
}
{\colortbl;\red255\green255\blue255;\red48\green48\blue54;\red236\green236\blue236;}
{\*\expandedcolortbl;;\cssrgb\c24706\c24706\c27451;\cssrgb\c94118\c94118\c94118;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 // backend/x-api-config.js\
class XApiConfig \{\
  constructor() \{\
    this.bearerToken = process.env.
\f1 \cf0 \cb1 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 AAAAAAAAAAAAAAAAAAAAAEIh7QEAAAAA8cYLrvratV94KkKyFc0ucHjXu3o%3DIvyUwwNZNXTS2Yi6sxqE8rIZnLuq4ZTu1KzCqhk7ssPnd63sfZ
\f0 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 ;\
    this.baseUrl = 'https://api.x.com/2';\
  \}\
\
  async makeRequest(endpoint, params = \{\}) \{\
    if (!this.bearerToken) \{\
      throw new Error('X API Bearer Token \uc0\u26410 \u37197 \u32622 ');\
    \}\
\
    const url = `$\{this.baseUrl\}$\{endpoint\}`;\
    const queryParams = new URLSearchParams(params).toString();\
    const fullUrl = queryParams ? `$\{url\}?$\{queryParams\}` : url;\
\
    try \{\
      const response = await fetch(fullUrl, \{\
        method: 'GET',\
        headers: \{\
          'Authorization': `Bearer $\{this.bearerToken\}`,\
          'Content-Type': 'application/json'\
        \}\
      \});\
\
      if (!response.ok) \{\
        throw new Error(`API \uc0\u35831 \u27714 \u22833 \u36133 : $\{response.status\} $\{response.statusText\}`);\
      \}\
\
      return await response.json();\
    \} catch (error) \{\
      console.error('API\uc0\u35831 \u27714 \u38169 \u35823 :', error);\
      throw error;\
    \}\
  \}\
\}\
\
export default XApiConfig;
\f2\fs28 \
}