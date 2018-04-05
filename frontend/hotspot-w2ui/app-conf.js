// User-configurable part
var appConfig = {
    attempts: 3,
    passLength: 4,
    phoneLength: 11,
    phoneMask: "+7 (9ZZ) ZZZ-ZZ-ZZ",
    phonePlaceholder: "9XX XXX XX XX",
    defaultLang: "ru",
    phoneField: "phone",
    img: {
        ok: "/assets/frontend/default/check.png",
        globe: "/assets/frontend/default/globe.png",
        flag: "/assets/frontend/default/russia.png",
        world: "/assets/frontend/default/world.png",
    },
    isp: {
        name: "ООО Метробит",
        logo: "/assets/frontend/default/metrobit.png",
        logoWidth: 90,
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

