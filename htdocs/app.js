// Setup UI language
let language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
let appStr = appStrings[language.replace(/-.*$/, "")];
if (appStr == undefined) {
    appStr = appStrings.en;
}

// 
let appConfig = {
    isp: {},
    hotspot: {},
};

////////////////////////////////////////////////////////////////////////

function mkLayout() {
    let top = 'background-color: #ffffff;';
    let bottom = 'background-color: #ffffff; padding-top: 10px;';
    $('#root').w2layout({
        name: 'myLayout',
        panels: [
            { type: 'top', size: 150, style: top, content: '<div style="font-size: 11px;"><center><img src="' + info.hotspot.logo + '" alt="hotspot owner logo" height="110" width="110"><p>' + appStr.hotspotOwner + ' ' + info.hotspot.name + '</center></div>',},
            { type: 'main', size: 200, },
            { type: 'bottom', size: 150, style: bottom, content: '<div style="font-size: 11px;"><center><img src="' + info.isp.logo + '" alt="ISP logo" height="54" width="108"><p>' + appStr.provider + ' ' + info.isp.name + '</center></div>',},
        ],
    });
}

////////////////////////////////////////////////////////////////////////

function mkRulesForm() {

    $('#formRules').w2form({ 
        name: 'formRules',
        header: appStr.readRules,
        formHTML: 
            '<div class="w2ui-page page-0">'+
            '    <div style="width: 380px; height: 50px; font-size: 12px; display: block; margin-left: auto; margin-right: auto;">'+
            '        ' + appStr.rules + 
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="reset">' + appStr.doNotAgree + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.agree + '</button>'+
            '</div>',
        actions: {
            "reset": function () {
                         w2popup.open({
                             title   : 'Popup Title HTML',
                             body    : '<p>' + appStr.denyAccess,
                         });
                     },
            "save": function () {
                        mkPhoneForm();
                        $('input[name="phone"]').mask('+7 (9ZZ) ZZZ-ZZ-ZZ', {placeholder: "9XX XXX XX XX", clearIfNotMatch: true, translation: { Z: {pattern: /\d/}, 9: {pattern: /9/}}});
                        w2ui['myLayout'].content('main', w2ui['formPhone']);
                    }
        },
    });
}

////////////////////////////////////////////////////////////////////////

function mkPhoneForm() {

    $('#formPhone').w2form({ 
        name: 'formPhone',
        header: appStr.enterPhoneNumber,
        formHTML: 
            '<div class="w2ui-page page-0">'+
            '    <div style="width: 380px; height: 50px; font-size: 12px; display: block; margin-left: auto; margin-right: auto;">'+
            '        <p style="line-height: 1.4;">' + appStr.enterPhoneNumber + '.' +
            '        <p style="line-height: 1.4;">' + appStr.passwordWillBeSent + '.' +
            '    </div>'+
            '    <div class="w2ui-field">'+
            '        <div>'+
            '            <input id="p2" class="input-phone" name="phone" maxlength="15" size="15"/>'+
            '        </div>'+
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="reset">' + appStr.clear + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.send + '</button>'+
            '</div>',
        fields : [
            { name: 'phone', type: 'text', },
        ],
        actions: {
            "reset": function () { this.clear(); },
            "save": function () {
                        let phone = w2ui['formPhone'].record.phone.replace(/[^0-9]/g, "").replace(/^7/, "");
                        let reg = /^\d{10}$/;
                        if (phone != undefined && reg.test(phone)) {
                            let params = {
                                operation: "pass",
                                login: phone,
                            }
                            $.post("/api1", params, function(data) {
                                if (data.Error == 0) {
                                    mkPasswdForm(w2ui['formPhone'].record.phone);
                                    $('input[name="pass"]').mask('00000', {placeholder: "XXXXX", clearIfNotMatch: true, });
                                    w2ui['myLayout'].content('main', w2ui['formPassword']);
                                }
                                else {
                                    alert("Failed to send password")
                                    this.clear();
                                }
                            },"json")
                        }
                    }
        },
    });
}

////////////////////////////////////////////////////////////////////////

function mkPasswdForm(phone) {

    $('#formPassword').w2form({
        name   : 'formPassword',
        header   : appStr.enterPassword,
        formHTML:
            '<div class="w2ui-page page-0">'+
            '    <div style="width: 380px; height: 50px; font-size: 12px; display: block; margin-left: auto; margin-right: auto;">'+
            '        <p style="line-height: 1.4;">' + appStr.enterPassword + '.'+
            '        <p style="line-height: 1.4;">' + appStr.passwordWasSent + ' ' + phone + '.'+
            '    </div>'+
            '    <div class="w2ui-field">'+
            '        <div>'+
            '            <input id="p3" class="input-phone" name="pass" maxlength="15" size="15"/>'+
            '        </div>'+
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="newpass">' + appStr.newPass + '</button>'+
            '   <button class="btn" name="reset">' + appStr.clear + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.send + '</button>'+
            '</div>',
        fields : [
            { name: 'pass', type: 'text', },
        ],
        actions: {
            "reset": function () { this.clear(); },
            "save": function () {
                        let pass = w2ui['formPassword'].record.pass;
                        let reg = /^\d{5}$/;
                        if (pass != undefined && reg.test(pass)) {
                            alert(pass);
                        }
                        else {
                            this.clear();
                        }
            },
            "newpass": function () {
                           w2ui['myLayout'].content('main', w2ui['formPhone']);
            },
        },
    });
    w2ui['formPassword'].record.pass="";
}

////////////////////////////////////////////////////////////////////////

$(function(){

$.post("/api1", {operation: "info"}, function(data) {
    if (data.Error == "0") {
        info.isp.name = data.Isp.Name;
        info.isp.logo = data.Isp.Logo;
        info.hotspot.name = data.Hotspot.Name;
        info.hotspot.logo = data.Hotspot.Logo;
        info.hotspot.url_a = data.Hotspot.Url_a;
        info.hotspot.url_5 = data.Hotspot.Url_r;

        mkLayout();
        mkRulesForm();
        w2ui['myLayout'].content('main', w2ui['formRules']);
    }
    else {
        alert(data.ErrorMsg);
    }
},"json");
    
});

