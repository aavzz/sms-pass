// User-configurable part
var appConfig = {
    attempts: 3,
    passLength: 4,
    phoneLength: 11,
    phoneMask: "+7 (9ZZ) ZZZ-ZZ-ZZ",
    phonePlaceholder: "9XX XXX XX XX",
    defaultLang: "ru",
    isp: {
        name: "Best ISP ever",
        logo: "/assets/frontend/default/BlackbandedSeaperch.png",
        logoWidth: 100,
        logoHeight: 50,
    },
    hotspot: {
        //type: "mikrotik",
        type: "test",
        name: "Best hotspot ever",
        logo: "/assets/frontend/default/OrientalDollarbird.png",
        logoWidth: 160,
        logoHeight: 150,
        urlA: "http://.../login",
        urlR: "https://google.com",
    },
};

////////////////////////////////////////////////////////////////////////

// UI language auto-selection
var language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
var lang = language.replace(/-.*$/, "");
var appStr = appStrings[lang];
if (appStr == undefined) {
    lang = "en";
    appStr = appStrings.en;
}

