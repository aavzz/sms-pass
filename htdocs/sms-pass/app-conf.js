// User-configurable part
var appConfig = {
    attempts: 3,
    passLength: 4,
    phoneLength: 11,
    phoneMask: "+7 (9ZZ) ZZZ-ZZ-ZZ",
    phonePlaceholder: "9XX XXX XX XX",
    isp: {
        name: "ISP name",
        logo: "/assets/frontend/default/logo.png",
        logoWidth: 100,
        logoHeight: 50,
    },
    hotspot: {
        type: "mikrotik|test",
        name: "Acme inc.",
        logo: "/assets/frontend/default/hotspot.png",
        logoWidth: 100,
        logoHeight: 100,
        urlA: "http://...",
        urlR: "https://...",
    },
};

////////////////////////////////////////////////////////////////////////

// UI language auto-selection
var language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
var appStr = appStrings[language.replace(/-.*$/, "")];
if (appStr == undefined) {
    appStr = appStrings.en;
}

