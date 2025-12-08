
module.exports = {
  seo: {
  "title": "FastStore",
  "description": "A fast and performant store framework",
  "titleTemplate": "%s | FastStore",
  "author": "FastStore"
},

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: "demoaccount8giftlist",
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
    incrementAddress: false,
  },

  // Default session
  session: {
    currency: {
      code: "USD",
      symbol: "$",
    },
    locale: "en-US",
    channel: '{"salesChannel":1,"regionId":""}',
    country: "USA",
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },

  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs
  storeUrl: "https://demo8new.demoaccount19.com",
  secureSubdomain: "https://demo8new.demoaccount19.com",
  checkoutUrl: "https://demo8new.demoaccount19.com/checkout",
  loginUrl: "https://demo8new.demoaccount19.com/api/io/login",
  accountUrl: "https://demo8new.demoaccount19.com/api/io/account",

  previewRedirects: {
    home: '/',
    plp: "/home",
    search: "/s?q=Bouclair",
    pdp: "/fabric-and-natural-wood-stool/p",
  },

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: "/fabric-and-natural-wood-stool/p",
      collection: "/home",
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: "/fabric-and-natural-wood-stool/p",
      collection: "/home",
      collection_filtered: "/home/?category-1=home&brand=Bouclair&facets=category-1%2Cbrand%27",
      search: "/s?q=Bouclair",
    },
    browser: 'electron',
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: "",
  },

  experimental: {
    nodeVersion: 18,
    cypressVersion: 12,
  },

  vtexHeadlessCms: {
    webhookUrls: [
      "https://demoaccount8giftlist.myvtex.com/cms-releases/webhook-releases",
    ],
  },

  contentSource: {
    type: 'CP',
  },
};
