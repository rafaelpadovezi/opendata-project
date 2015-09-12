var Country = {
    _id: String, // code
    name: String,
    nameInPortuguese: String,
    classBy: [{'provider': String}],
    'indicator': [{ 'year' : Number}]
};

var Indicator = {
    _id: String, // 'indicator'
    description: String,
    source: String,
    link: String
};

var City = {
    _id: String,
    Country: String, // refs Country
    'indicator': [{ 'year' : Number}]
};