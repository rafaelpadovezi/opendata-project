db.indicators.update({code: 'cpi'},{ $set: {name:'Corruption Perceptions Index (CPI)', source:'Transparency International'}}, {multi:true})
db.indicators.update({code: 'hdi'},{ $set: {name:'Human Development Index (HDI)'}}, {multi:true})
db.indicators.update({code: 'ggxwdn_ngdp'},{ $set: {name:'General government net debt (% of GDP)', source: 'IMF'}}, {multi:true})