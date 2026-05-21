export interface MockDropoff {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  materials: string[];
  url?: string;
}

export const MOCK_DROPOFFS: MockDropoff[] = [
  // SF Bay Area
  {
    id: "sf-recology",
    name: "Recology San Francisco Transfer Station",
    lat: 37.7449,
    lng: -122.4019,
    address: "501 Tunnel Ave, San Francisco, CA",
    materials: ["electronics", "paint", "batteries", "lightbulbs", "metal"],
    url: "https://earth911.com"
  },
  {
    id: "sf-bestbuy-harrison",
    name: "Best Buy (Harrison St)",
    lat: 37.7762,
    lng: -122.4067,
    address: "1717 Harrison St, San Francisco, CA",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "sf-homedepot-bayshore",
    name: "Home Depot (Bayshore)",
    lat: 37.7263,
    lng: -122.4023,
    address: "303 Bayshore Blvd, San Francisco, CA",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  },
  {
    id: "oakland-davis-st",
    name: "Davis Street Transfer Station",
    lat: 37.6919,
    lng: -122.1417,
    address: "2615 Davis St, San Leandro, CA",
    materials: ["electronics", "paint", "batteries", "compost", "metal", "glass"],
    url: "https://earth911.com"
  },
  {
    id: "berkeley-ecology",
    name: "Berkeley Ecology Center Drop-off",
    lat: 37.8716,
    lng: -122.2727,
    address: "2530 San Pablo Ave, Berkeley, CA",
    materials: ["glass", "plastic", "metal", "batteries"],
    url: ""
  },
  {
    id: "sj-ikea",
    name: "IKEA (East Palo Alto)",
    lat: 37.4595,
    lng: -122.1455,
    address: "1700 E Bayshore Rd, East Palo Alto, CA",
    materials: ["batteries", "lightbulbs", "textiles"],
    url: ""
  },

  // Los Angeles
  {
    id: "la-sun-valley-hhw",
    name: "Sun Valley S.A.F.E. Center",
    lat: 34.2206,
    lng: -118.3848,
    address: "11025 Randall St, Sun Valley, CA",
    materials: ["paint", "batteries", "electronics", "lightbulbs"],
    url: "https://earth911.com"
  },
  {
    id: "la-bestbuy-westchester",
    name: "Best Buy (Westchester)",
    lat: 33.9588,
    lng: -118.3970,
    address: "8657 Sepulveda Eastway, Los Angeles, CA",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "la-homedepot-hollywood",
    name: "Home Depot (Hollywood)",
    lat: 34.0928,
    lng: -118.3287,
    address: "5600 Sunset Blvd, Los Angeles, CA",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  },
  {
    id: "la-glassell-park",
    name: "LA Sanitation (Glassell Park)",
    lat: 34.1102,
    lng: -118.2334,
    address: "2649 Fletcher Dr, Los Angeles, CA",
    materials: ["compost", "metal", "glass", "plastic"],
    url: ""
  },

  // NYC
  {
    id: "nyc-sims-brooklyn",
    name: "Sims Municipal Recycling (Brooklyn)",
    lat: 40.6716,
    lng: -74.0177,
    address: "472 2nd Ave, Brooklyn, NY",
    materials: ["glass", "plastic", "metal"],
    url: "https://earth911.com"
  },
  {
    id: "nyc-bestbuy-union",
    name: "Best Buy (Union Square)",
    lat: 40.7350,
    lng: -73.9908,
    address: "52 E 14th St, New York, NY",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "nyc-homedepot-23rd",
    name: "Home Depot (Chelsea)",
    lat: 40.7459,
    lng: -73.9989,
    address: "40 W 23rd St, New York, NY",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  },
  {
    id: "nyc-lower-east-compost",
    name: "LES Ecology Center Compost Drop-off",
    lat: 40.7191,
    lng: -73.9794,
    address: "East River Park, New York, NY",
    materials: ["compost"],
    url: ""
  },
  {
    id: "nyc-ikea-redhook",
    name: "IKEA (Red Hook)",
    lat: 40.6712,
    lng: -74.0138,
    address: "1 Beard St, Brooklyn, NY",
    materials: ["batteries", "lightbulbs", "textiles"],
    url: ""
  },

  // Chicago
  {
    id: "chi-goose-island-hhw",
    name: "Chicago HHW Facility (Goose Island)",
    lat: 41.9094,
    lng: -87.6553,
    address: "1150 N North Branch St, Chicago, IL",
    materials: ["paint", "batteries", "electronics", "lightbulbs"],
    url: "https://earth911.com"
  },
  {
    id: "chi-bestbuy-roosevelt",
    name: "Best Buy (Roosevelt Collection)",
    lat: 41.8674,
    lng: -87.6398,
    address: "1144 S Clark St, Chicago, IL",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "chi-homedepot-lincoln",
    name: "Home Depot (Lincoln Park)",
    lat: 41.9223,
    lng: -87.6555,
    address: "2665 N Halsted St, Chicago, IL",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  },

  // Seattle
  {
    id: "sea-south-recycling",
    name: "South Recycling & Disposal Station",
    lat: 47.5277,
    lng: -122.3127,
    address: "8105 5th Ave S, Seattle, WA",
    materials: ["electronics", "metal", "glass", "compost", "paint"],
    url: "https://earth911.com"
  },
  {
    id: "sea-bestbuy-northgate",
    name: "Best Buy (Northgate)",
    lat: 47.7062,
    lng: -122.3257,
    address: "330 NE Northgate Way, Seattle, WA",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "sea-ikea-renton",
    name: "IKEA (Renton)",
    lat: 47.4595,
    lng: -122.2554,
    address: "601 SW 41st St, Renton, WA",
    materials: ["batteries", "lightbulbs", "textiles"],
    url: ""
  },

  // Boston
  {
    id: "bos-zerowaste",
    name: "Boston Public Works Yard",
    lat: 42.3199,
    lng: -71.0664,
    address: "315 Gibson St, Dorchester, MA",
    materials: ["electronics", "metal", "paint", "batteries"],
    url: "https://earth911.com"
  },
  {
    id: "bos-bestbuy-cambridge",
    name: "Best Buy (Cambridgeside)",
    lat: 42.3683,
    lng: -71.0764,
    address: "100 Cambridgeside Pl, Cambridge, MA",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "bos-homedepot-southbay",
    name: "Home Depot (South Bay)",
    lat: 42.3267,
    lng: -71.0689,
    address: "5 Allstate Rd, Boston, MA",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  },

  // Austin
  {
    id: "atx-recycle-reuse",
    name: "Austin Recycle & Reuse Drop-off Center",
    lat: 30.2237,
    lng: -97.7714,
    address: "2514 Business Center Dr, Austin, TX",
    materials: ["paint", "batteries", "electronics", "lightbulbs", "compost"],
    url: "https://earth911.com"
  },
  {
    id: "atx-bestbuy-arboretum",
    name: "Best Buy (Arboretum)",
    lat: 30.4030,
    lng: -97.7510,
    address: "10515 N Mopac Expy, Austin, TX",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "atx-ikea-roundrock",
    name: "IKEA (Round Rock)",
    lat: 30.5380,
    lng: -97.7100,
    address: "1 IKEA Way, Round Rock, TX",
    materials: ["batteries", "lightbulbs", "textiles"],
    url: ""
  },

  // Denver
  {
    id: "den-cherrycreek",
    name: "Denver Cherry Creek Recycling Drop-off",
    lat: 39.7080,
    lng: -104.9347,
    address: "7301 E Cherry Creek S Dr, Denver, CO",
    materials: ["glass", "plastic", "metal", "paper"],
    url: ""
  },
  {
    id: "den-bestbuy-glendale",
    name: "Best Buy (Glendale)",
    lat: 39.7045,
    lng: -104.9358,
    address: "4100 E Mexico Ave, Denver, CO",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "den-hhw",
    name: "Denver Household Hazardous Waste",
    lat: 39.7700,
    lng: -104.9847,
    address: "1391 N Delaware St, Denver, CO",
    materials: ["paint", "batteries", "lightbulbs"],
    url: "https://earth911.com"
  },

  // Atlanta
  {
    id: "atl-cha-recycle",
    name: "CHaRM (Center for Hard to Recycle Materials)",
    lat: 33.7188,
    lng: -84.4290,
    address: "1110 Hill St SE, Atlanta, GA",
    materials: ["electronics", "paint", "batteries", "textiles", "lightbulbs"],
    url: "https://earth911.com"
  },
  {
    id: "atl-bestbuy-midtown",
    name: "Best Buy (Midtown)",
    lat: 33.7857,
    lng: -84.3811,
    address: "2535 Piedmont Rd NE, Atlanta, GA",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "atl-homedepot-buckhead",
    name: "Home Depot (Buckhead)",
    lat: 33.8528,
    lng: -84.3641,
    address: "2295 Lawrenceville Hwy, Atlanta, GA",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  },

  // Miami
  {
    id: "mia-resource-recovery",
    name: "Miami-Dade Resource Recovery",
    lat: 25.8531,
    lng: -80.3711,
    address: "6990 NW 97th Ave, Doral, FL",
    materials: ["electronics", "paint", "batteries"],
    url: "https://earth911.com"
  },
  {
    id: "mia-bestbuy-dadeland",
    name: "Best Buy (Dadeland)",
    lat: 25.6890,
    lng: -80.3168,
    address: "8423 S Dixie Hwy, Miami, FL",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "mia-ikea-sweetwater",
    name: "IKEA (Sweetwater)",
    lat: 25.7626,
    lng: -80.3743,
    address: "1801 NW 117th Ave, Sweetwater, FL",
    materials: ["batteries", "lightbulbs", "textiles"],
    url: ""
  },

  // Portland, OR
  {
    id: "pdx-far-west",
    name: "Far West Recycling (Portland)",
    lat: 45.5236,
    lng: -122.6750,
    address: "10750 SW Denney Rd, Beaverton, OR",
    materials: ["electronics", "metal", "glass", "plastic", "paint"],
    url: "https://earth911.com"
  },
  {
    id: "pdx-bestbuy-jantzen",
    name: "Best Buy (Jantzen Beach)",
    lat: 45.6107,
    lng: -122.6770,
    address: "1100 N Hayden Meadows Dr, Portland, OR",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "pdx-metro-hhw",
    name: "Metro Central Transfer Station",
    lat: 45.5469,
    lng: -122.7340,
    address: "6161 NW 61st Ave, Portland, OR",
    materials: ["paint", "batteries", "lightbulbs", "compost"],
    url: ""
  },

  // DC
  {
    id: "dc-ft-totten",
    name: "Fort Totten Transfer Station",
    lat: 38.9510,
    lng: -77.0066,
    address: "4900 John F McCormack Dr NE, Washington, DC",
    materials: ["electronics", "paint", "batteries", "metal"],
    url: "https://earth911.com"
  },
  {
    id: "dc-bestbuy-tenleytown",
    name: "Best Buy (Tenleytown)",
    lat: 38.9476,
    lng: -77.0786,
    address: "4500 Wisconsin Ave NW, Washington, DC",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "dc-homedepot-rhode",
    name: "Home Depot (Rhode Island Ave)",
    lat: 38.9213,
    lng: -76.9873,
    address: "901 Rhode Island Ave NE, Washington, DC",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  },

  // Phoenix
  {
    id: "phx-27th-ave",
    name: "27th Avenue Transfer Station",
    lat: 33.5031,
    lng: -112.1192,
    address: "3060 S 27th Ave, Phoenix, AZ",
    materials: ["paint", "batteries", "electronics", "lightbulbs"],
    url: "https://earth911.com"
  },
  {
    id: "phx-bestbuy-camelback",
    name: "Best Buy (Camelback)",
    lat: 33.5092,
    lng: -112.0740,
    address: "1949 E Camelback Rd, Phoenix, AZ",
    materials: ["electronics", "batteries"],
    url: ""
  },
  {
    id: "phx-homedepot-tempe",
    name: "Home Depot (Tempe Marketplace)",
    lat: 33.4309,
    lng: -111.9698,
    address: "2017 E Rio Salado Pkwy, Tempe, AZ",
    materials: ["batteries", "lightbulbs", "paint"],
    url: ""
  }
];
