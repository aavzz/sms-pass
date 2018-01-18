// UI strings and messages in different languages
let appStrings = {

    ru: {
        enterPhoneNumber: "Введите номер телефона",
        passwordWillBeSent: "Пароль будет выслан на указанный номер",
        send: 'Отправить',
        clear: 'Стереть',
        enterPassword: "Введите пароль",
        passwordWasSent: "Пароль был выслан на номер",
        newPass: "Запросить новый",
        readRules: "Ознакомьтесь с правилами",
        hotspotOwner: "Хотспот принадлежит",
        provider: "Интернет-провайдер",
        rules: `
<p style="line-height: 1.4; padding-bottom: 12px; font-weight: bold;">Правила пользования сетью Wi-Fi (WiFi Хотспот)
<p style="line-height: 1.4; padding-bottom: 10px; font-weifht: bold;">1. Доступ к сети Интернет, посредством WiFi Хотспот, не является коммерческой услугой и предоставляется на безвозмездной основе.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold">2. Пользователю Хотспота запрещено:
<p style="line-height: 1.4; padding-bottom: 5px;">2.1. Размещать информацию, распространение которой запрещено или ограничено законодательством.
<p style="line-height: 1.4; padding-bottom: 5px;">2.2. Распространять информацию, оскорбляющую честь, достоинство и деловую репутацию пользователей сети Интернет.
<p style="line-height: 1.4; padding-bottom: 5px;">2.3. Нарушать авторские права на информацию, размещенную в сети Интернет.
<p style="line-height: 1.4; padding-bottom: 5px;">2.4. Заниматься массовой рассылкой, не запрошенной адресатом.
<p style="line-height: 1.4; padding-bottom: 5px;">2.5. Осуществлять любые действия, которые могут привести к нарушению функционирования сети Хотспот.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">3. Владелец Хотспот не несет ответственность:
<p style="line-height: 1.4; padding-bottom: 5px;">3.1. За любые затраты или ущерб, прямо или косвенно возникшие в результате пользования или невозможности пользования услугой доступа к сети Интернет.
<p style="line-height: 1.4; padding-bottom: 10px;">3.2. За охват WiFi сигнала и пропускную способность WiFi сети.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">4. Пользователь выражает согласие и разрешает оператору связи обрабатывать свои персональные данные (номер мобильного телефона) любым не запрещенным законодательством образом..
<p style="line-height: 1.4; padding-bottom: 10px; font-weight: bold;">5. Нажимая кнопку "Согласен", пользователь соглашается с данными условиями.
`,
        agree: 'Согласен',
        doNotAgree: 'Не согласен',
        denyAccess: 'Для получения доступа необходимо согласиться с Правилами'
    },

    en: {
        enterPhoneNumber: "Enter phone number",
        passwordWillBeSent: "Password will be sent to the phone number specified",
        send: "Send",
        clear: "Reset",
        enterPassword: "Enter password",
        passwordWasSent: "The password was sent to",
        newPass: "Request new password",
        readRules: "Be informed of the service conditions",
        hotspotOwner: "WiFi hotspot service owner",
        provider: "Internet service provider",
        rules: `
<p style="line-height: 1.4; padding-bottom: 12px; font-weight: bold;">WiFi hotspot service conditions
<p style="line-height: 1.4; padding-bottom: 10px; font-weifht: bold;">1. Internet access via this Wifi hotspot is provided free of charge.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold">2. The user of this WiFi hotspot is not allowed to:
<p style="line-height: 1.4; padding-bottom: 5px;">2.1. Use the Service to transmit any material that violates any applicable local, national or international law, or any rule or regulations promulgated thereunder.
<p style="line-height: 1.4; padding-bottom: 5px;">2.2. Use the Service to harm, or attempt to harm other persons, businesses or other entities.
<p style="line-height: 1.4; padding-bottom: 5px;">2.3. Use the Service to transmit any material that infringes any copyright, trademark, patent, trade secret, or other proprietary rights of any third party.
<p style="line-height: 1.4; padding-bottom: 5px;">2.4. Use the Service to transmit or facilitate any unsolicited commercial messages or unsolicited bulk messages. 
<p style="line-height: 1.4; padding-bottom: 5px;">2.5. Use the Service for any activities, which adversely affect the ability of other people or systems to use the Wi-Fi service or the Internet.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">3. WiFi hotspot service owner is not liable to you for:
<p style="line-height: 1.4; padding-bottom: 5px;">3.1. Any direct, indirect, incidental, special or consequential damages of any kind as a result of using or inavailability of the Service.
<p style="line-height: 1.4; padding-bottom: 10px;">3.2. Service interruptions and/or outages, as well as the speed and overall quality of service.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">4. The user gives the express permission to the ISP to collect, store and process his/her personal data.
<p style="line-height: 1.4; padding-bottom: 10px; font-weight: bold;">5. By pressing the "Accept" button the user fully accepts the above WiFi hotspot service conditions.
`,
        agree: "Accept",
        doNotAgree: "Reject",
        denyAccess: "Please, accept the service conditions",
    },

    es: {
        enterPhoneNumber: "Entra el número de celular",
        passwordWillBeSent: "La contraseña será enviada al numero entrado",
        send: "Enviar",
        clear: "Borrar",
        enterPassword: "Entra la contraseña",
        passwordWasSent: "La contraseña fue enviada al número",
        newPass: "Cambiar contraseña",
        readRules: "Acepta las condiciones de servicio",
        hotspotOwner: "El Hotspot pertenece a",
        provider: "Proveedor de servicio internet",
        rules: `
<p style="line-height: 1.4; padding-bottom: 12px; font-weight: bold;">Правила и условия пользования сетью Wi-Fi (WiFi Хотспот)
<p style="line-height: 1.4; padding-bottom: 10px; font-weifht: bold;">1. Доступ к сети Интернет, посредством WiFi Хотспот, не является коммерческой услугой и предоставляется на безвозмездной основе.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold">2. Пользователю Хотспота запрещено:
<p style="line-height: 1.4; padding-bottom: 5px;">2.1. Размещать информацию, распространение которой запрещено или ограничено законодательством.
<p style="line-height: 1.4; padding-bottom: 5px;">2.2. Распространять информацию, оскорбляющую честь, достоинство и деловую репутацию пользователей сети Интернет.
<p style="line-height: 1.4; padding-bottom: 5px;">2.3. Нарушать авторские права на информацию, размещенную в сети Интернет.
<p style="line-height: 1.4; padding-bottom: 5px;">2.4. Заниматься массовой рассылкой, не запрошенной адресатом.
<p style="line-height: 1.4; padding-bottom: 5px;">2.5. Осуществлять любые действия, которые могут привести к нарушению функционирования сети Хотспот.
<p style="line-height: 1.4; padding-bottom: 10px;">2.7. Публиковать или передавать любую информацию или программное обеспечение, которое содержит в себе компьютерные вирусы.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">3. Владелец Хотспот не несет ответственность:
<p style="line-height: 1.4; padding-bottom: 5px;">3.1. За любые затраты или ущерб, прямо или косвенно возникшие в результате пользования или невозможности пользования услугой доступа к сети Интернет.
<p style="line-height: 1.4; padding-bottom: 10px;">3.2. За охват WiFi сигнала и пропускную способность WiFi сети.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">4. Пользователь выражает согласие и разрешает владельцу Wi-Fi Хотспота обрабатывать свои персональные данные (номер мобильного телефона) любым не запрещенным законодательством образом..
<p style="line-height: 1.4; padding-bottom: 10px; font-weight: bold;">5. Нажимая кнопку "Согласен", пользователь соглашается с данными условиями.
:w
:w
`,
        agree: "Aceptar",
        doNotAgree: "Rechazar",
        denyAccess: "Acepta las condiciones de servicio, por favor",
    },

}

let language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
let appStr = appStrings[language.replace(/-.*$/, "")];
if (appStr == undefined) {
    appStr = appStrings.en;
}

////////////////////////////////////////////////////////////////////////

function mkLayout() {

    let top = 'background-color: #ffffff;';
    let bottom = 'background-color: #ffffff; padding-top: 10px;';
    $('#root').w2layout({
        name: 'myLayout',
        panels: [
            { type: 'top', size: 150, style: top, content: '<div style="font-size: 11px;"><center><img src="rk.png" alt="Roga&Kopyta logo" height="110" width="110"><p>' + appStr.hotspotOwner + '</center></div>',},
            { type: 'main', size: 200, },
            { type: 'bottom', size: 150, style: bottom, content: '<div style="font-size: 11px;"><center><img src="telix3.png" alt="Telix logo" height="54" width="108"><p>' + appStr.provider + '</center></div>',},
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
            "reset": function () { alert(appStr.denyAccess); },
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
                            $.get("/api1", params, function(data) {
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
    mkLayout();
    mkRulesForm();
    w2ui['myLayout'].content('main', w2ui['formRules']);
});
