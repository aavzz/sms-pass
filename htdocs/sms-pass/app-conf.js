// User-configurable part
let appConfig = {
    attempts: 3,
    passLength: 5,
    phoneMask: "+7 (9ZZ) ZZZ-ZZ-ZZ"
    phonePlaceholder: "9XX XXX XX XX"
    isp: {
        name: "ISP name",
        logo" "path to ISP logo",
        logoWidth: 100,
        logoHeight: 100,
    },
    hotspot: {
        type: "mikrotik|test",
        name: "Acme inc.",
        logo: "path to client logo",
        logoWidth: 100,
        logoHeight: 100,
        urlA: "authentication URL",
        urlR: "client start page",
    },
};

////////////////////////////////////////////////////////////////////////

// UI language auto-selection
let language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
let appStr = appStrings[language.replace(/-.*$/, "")];
if (appStr == undefined) {
    appStr = appStrings.en;
}

