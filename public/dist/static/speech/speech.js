//Look for other speechVoices instances
/*if (window.parent != null) {
    var iframes = window.parent.document.getElementsByTagName('iframe');
    for (var i = 0; i < iframes.length; i++) {
        //iframes[i].style.width = "300px"
    }
}*/

var audioList = [];

if (typeof speechVoices != 'undefined') {
    console.log('speechVoices already loaded');
    console.log(speechVoices);
} else {

    var Speech = function () {

        var self = this;

        self.version = 3;
        console.log("speechVoices r" + self.version);

        // Our own collection of voices
        var speechVoices = [
        {name:"UK English Female",flag:"gb",gender:"f",voiceIDs:[3,5,1,6,7,171,278,201,257,286,342,258,287,343,8]},
        {name:"UK English Male",flag:"gb",gender:"m",voiceIDs:[0,4,2,75,277,202,256,285,341,159,6,7]},
        {name:"US English Female",flag:"us",gender:"f",voiceIDs:[39,40,41,42,43,173,205,204,235,283,339,44]},
        {name:"Arabic Male",flag:"ar",gender:"m",voiceIDs:[96,95,97,196,98],deprecated:!0},
        {name:"Arabic Female",flag:"ar",gender:"f",voiceIDs:[96,95,97,196,98]},
        {name:"Armenian Male",flag:"hy",gender:"f",voiceIDs:[99]},
        {name:"Australian Female",flag:"au",gender:"f",voiceIDs:[87,86,5,276,201,88]},
        {name:"Brazilian Portuguese Female",flag:"br",gender:"f",voiceIDs:[245,124,123,125,186,223,126]},
        {name:"Chinese Female",flag:"cn",gender:"f",voiceIDs:[249,58,59,60,155,191,281,231,268,297,353,269,298,354,61]},
        {name:"Chinese (Hong Kong) Female",flag:"hk",gender:"f",voiceIDs:[192,193,232,250,251,270,299,355,252]},
        {name:"Chinese Taiwan Female",flag:"tw",gender:"f",voiceIDs:[194,233,253,254,305,322,361,319,336,375,255]},
        {name:"Czech Female",flag:"cz",gender:"f",voiceIDs:[101,100,102,197,103]},
        {name:"Danish Female",flag:"dk",gender:"f",voiceIDs:[105,104,106,198,107]},
        {name:"Deutsch Female",flag:"de",gender:"f",voiceIDs:[27,28,29,30,31,78,170,275,199,261,290,346,262,291,347,32]},
        {name:"Dutch Female",flag:"nl",gender:"f",voiceIDs:[243,219,84,157,158,184,45]},
        {name:"Finnish Female",flag:"fi",gender:"f",voiceIDs:[90,89,91,209,92]},
        {name:"French Female",flag:"fr",gender:"f",voiceIDs:[240,21,22,23,77,178,279,210,266,295,351,304,321,360,26]},
        {name:"Greek Female",flag:"gr",gender:"f",voiceIDs:[62,63,80,200,64]},
        {name:"Hindi Female",flag:"hi",gender:"f",voiceIDs:[247,66,154,179,213,259,288,344,67]},
        {name:"Hungarian Female",flag:"hu",gender:"f",voiceIDs:[9,10,81,214,11]},
        {name:"Indonesian Female",flag:"id",gender:"f",voiceIDs:[241,111,112,180,215,113]},
        {name:"Italian Female",flag:"it",gender:"f",voiceIDs:[242,33,34,35,36,37,79,181,216,271,300,356,38]},
        {name:"Japanese Female",flag:"jp",gender:"f",voiceIDs:[248,50,51,52,153,182,280,217,273,302,358,274,303,359,53]},
        {name:"Korean Female",flag:"kr",gender:"f",voiceIDs:[54,55,56,156,183,218,306,323,362,57]},
        {name:"Latin Female",flag:"va",gender:"f",voiceIDs:[114]},
        {name:"Norwegian Female",flag:"no",gender:"f",voiceIDs:[72,73,221,74]},
        {name:"Polish Female",flag:"pl",gender:"f",voiceIDs:[244,120,119,121,185,222,267,296,352,122]},
        {name:"Portuguese Female",flag:"br",gender:"f",voiceIDs:[128,127,129,187,224,272,301,357,130]},
        {name:"Romanian Male",flag:"ro",gender:"m",voiceIDs:[151,150,152,225,46]},
        {name:"Russian Female",flag:"ru",gender:"f",voiceIDs:[246,47,48,83,188,226,260,289,345,49]},
        {name:"Slovak Female",flag:"sk",gender:"f",voiceIDs:[133,132,134,227,135]},
        {name:"Spanish Female",flag:"es",gender:"f",voiceIDs:[19,238,16,17,18,20,76,174,207,263,292,348,264,293,349,15]},
        {name:"Spanish Latin American Female",flag:"es",gender:"f",voiceIDs:[239,137,136,138,175,208,265,294,350,139]},
        {name:"Swedish Female",flag:"sv",gender:"f",voiceIDs:[85,148,149,228,65]},
        {name:"Tamil Male",flag:"hi",gender:"m",voiceIDs:[141]},
        {name:"Thai Female",flag:"th",gender:"f",voiceIDs:[143,142,144,189,229,145]},
        {name:"Turkish Female",flag:"tr",gender:"f",voiceIDs:[69,70,82,190,230,71]},
        {name:"Afrikaans Male",flag:"af",gender:"m",voiceIDs:[93]},
        {name:"Albanian Male",flag:"sq",gender:"m",voiceIDs:[94]},
        {name:"Bosnian Male",flag:"bs",gender:"m",voiceIDs:[14]},
        {name:"Catalan Male",flag:"catalonia",gender:"m",voiceIDs:[68]},
        {name:"Croatian Male",flag:"hr",gender:"m",voiceIDs:[13]},
        {name:"Czech Male",flag:"cz",gender:"m",voiceIDs:[161]},
        {name:"Danish Male",flag:"da",gender:"m",voiceIDs:[162],deprecated:!0},
        {name:"Esperanto Male",flag:"eo",gender:"m",voiceIDs:[108]},
        {name:"Finnish Male",flag:"fi",gender:"m",voiceIDs:[160],deprecated:!0},
        {name:"Greek Male",flag:"gr",gender:"m",voiceIDs:[163],deprecated:!0},
        {name:"Hungarian Male",flag:"hu",gender:"m",voiceIDs:[164]},
        {name:"Icelandic Male",flag:"is",gender:"m",voiceIDs:[110]},
        {name:"Latin Male",flag:"va",gender:"m",voiceIDs:[165],deprecated:!0},
        {name:"Latvian Male",flag:"lv",gender:"m",voiceIDs:[115]},
        {name:"Macedonian Male",flag:"mk",gender:"m",voiceIDs:[116]},
        {name:"Moldavian Male",flag:"md",gender:"m",voiceIDs:[117]},
        {name:"Montenegrin Male",flag:"me",gender:"m",voiceIDs:[118]},
        {name:"Norwegian Male",flag:"no",gender:"m",voiceIDs:[166]},
        {name:"Serbian Male",flag:"sr",gender:"m",voiceIDs:[12]},
        {name:"Serbo-Croatian Male",flag:"hr",gender:"m",voiceIDs:[131]},
        {name:"Slovak Male",flag:"sk",gender:"m",voiceIDs:[167],deprecated:!0},
        {name:"Swahili Male",flag:"sw",gender:"m",voiceIDs:[140]},
        {name:"Swedish Male",flag:"sv",gender:"m",voiceIDs:[168],deprecated:!0},
        {name:"Vietnamese Male",flag:"vi",gender:"m",voiceIDs:[146],deprecated:!0},
        {name:"Welsh Male",flag:"cy",gender:"m",voiceIDs:[147]},
        {name:"US English Male",flag:"us",gender:"m",voiceIDs:[234,282,338,236,284,340,237,2,4,0,6,7,75,159]},
        {name:"Fallback UK Female",flag:"gb",gender:"f",voiceIDs:[8]}];

        //All voices available on every system and device
        var voicecollection = [{name:"Google UK English Male"},{name:"Agnes"},{name:"Daniel Compact"},{name:"Google UK English Female"},{name:"en-GB",rate:.25,pitch:1},{name:"en-AU",rate:.25,pitch:1},{name:"ingl\u00e9s Reino Unido"},{name:"English United Kingdom"},{name:"Fallback en-GB Female",lang:"en-GB",fallbackvoice:!0},{name:"Eszter Compact"},{name:"hu-HU",rate:.4},
        {name:"Fallback Hungarian",lang:"hu",fallbackvoice:!0,service:"g2"},{name:"Fallback Serbian",lang:"sr",fallbackvoice:!0},{name:"Fallback Croatian",lang:"hr",fallbackvoice:!0},{name:"Fallback Bosnian",lang:"bs",fallbackvoice:!0},{name:"Fallback Spanish",lang:"es",fallbackvoice:!0},{name:"Spanish Spain"},{name:"espa\u00f1ol Espa\u00f1a"},{name:"Diego Compact",rate:.3},{name:"Google Espa\u00f1ol"},{name:"es-ES",rate:.2},{name:"Google Fran\u00e7ais"},{name:"French France"},{name:"franc\u00e9s Francia"},
        {name:"Virginie Compact",rate:.5},{name:"fr-FR",rate:.25},{name:"Fallback French",lang:"fr",fallbackvoice:!0},{name:"Google Deutsch"},{name:"German Germany"},{name:"alem\u00e1n Alemania"},{name:"Yannick Compact",rate:.5},{name:"de-DE",rate:.25},{name:"Fallback Deutsch",lang:"de",fallbackvoice:!0},{name:"Google Italiano"},{name:"Italian Italy"},{name:"italiano Italia"},{name:"Paolo Compact",rate:.5},{name:"it-IT",rate:.25},{name:"Fallback Italian",lang:"it",fallbackvoice:!0},{name:"Google US English",
        timerSpeed:1},{name:"English United States"},{name:"ingl\u00e9s Estados Unidos"},{name:"Vicki"},{name:"en-US",rate:.2,pitch:1,timerSpeed:1.3},{name:"Fallback English",lang:"en-US",fallbackvoice:!0,timerSpeed:0},{name:"Fallback Dutch",lang:"nl",fallbackvoice:!0,timerSpeed:0},{name:"Fallback Romanian",lang:"ro",fallbackvoice:!0},{name:"Milena Compact"},{name:"ru-RU",rate:.25},{name:"Fallback Russian",lang:"ru",fallbackvoice:!0},{name:"Google \u65e5\u672c\u4eba",timerSpeed:1},{name:"Kyoko Compact"},
        {name:"ja-JP",rate:.25},{name:"Fallback Japanese",lang:"ja",fallbackvoice:!0},{name:"Google \ud55c\uad6d\uc758",timerSpeed:1},{name:"Narae Compact"},{name:"ko-KR",rate:.25},{name:"Fallback Korean",lang:"ko",fallbackvoice:!0},{name:"Google \u4e2d\u56fd\u7684",timerSpeed:1},{name:"Ting-Ting Compact"},{name:"zh-CN",rate:.25},{name:"Fallback Chinese",lang:"zh-CN",fallbackvoice:!0},{name:"Alexandros Compact"},{name:"el-GR",rate:.25},{name:"Fallback Greek",lang:"el",fallbackvoice:!0,service:"g2"},{name:"Fallback Swedish",
        lang:"sv",fallbackvoice:!0,service:"g2"},{name:"hi-IN",rate:.25},{name:"Fallback Hindi",lang:"hi",fallbackvoice:!0},{name:"Fallback Catalan",lang:"ca",fallbackvoice:!0},{name:"Aylin Compact"},{name:"tr-TR",rate:.25},{name:"Fallback Turkish",lang:"tr",fallbackvoice:!0},{name:"Stine Compact"},{name:"no-NO",rate:.25},{name:"Fallback Norwegian",lang:"no",fallbackvoice:!0,service:"g2"},{name:"Daniel"},{name:"Monica"},{name:"Amelie"},{name:"Anna"},{name:"Alice"},{name:"Melina"},{name:"Mariska"},{name:"Yelda"},
        {name:"Milena"},{name:"Xander"},{name:"Alva"},{name:"Lee Compact"},{name:"Karen"},{name:"Fallback Australian",lang:"en-AU",fallbackvoice:!0},{name:"Mikko Compact"},{name:"Satu"},{name:"fi-FI",rate:.25},{name:"Fallback Finnish",lang:"fi",fallbackvoice:!0,service:"g2"},{name:"Fallback Afrikans",lang:"af",fallbackvoice:!0},{name:"Fallback Albanian",lang:"sq",fallbackvoice:!0},{name:"Maged Compact"},{name:"Tarik"},{name:"ar-SA",rate:.25},{name:"Fallback Arabic",lang:"ar",fallbackvoice:!0,service:"g2"},
        {name:"Fallback Armenian",lang:"hy",fallbackvoice:!0,service:"g2"},{name:"Zuzana Compact"},{name:"Zuzana"},{name:"cs-CZ",rate:.25},{name:"Fallback Czech",lang:"cs",fallbackvoice:!0,service:"g2"},{name:"Ida Compact"},{name:"Sara"},{name:"da-DK",rate:.25},{name:"Fallback Danish",lang:"da",fallbackvoice:!0,service:"g2"},{name:"Fallback Esperanto",lang:"eo",fallbackvoice:!0},{name:"Fallback Haitian Creole",lang:"ht",fallbackvoice:!0},{name:"Fallback Icelandic",lang:"is",fallbackvoice:!0},{name:"Damayanti"},
        {name:"id-ID",rate:.25},{name:"Fallback Indonesian",lang:"id",fallbackvoice:!0},{name:"Fallback Latin",lang:"la",fallbackvoice:!0,service:"g2"},{name:"Fallback Latvian",lang:"lv",fallbackvoice:!0},{name:"Fallback Macedonian",lang:"mk",fallbackvoice:!0},{name:"Fallback Moldavian",lang:"mo",fallbackvoice:!0,service:"g2"},{name:"Fallback Montenegrin",lang:"sr-ME",fallbackvoice:!0},{name:"Agata Compact"},{name:"Zosia"},{name:"pl-PL",rate:.25},{name:"Fallback Polish",lang:"pl",fallbackvoice:!0},{name:"Raquel Compact"},
        {name:"Luciana"},{name:"pt-BR",rate:.25},{name:"Fallback Brazilian Portugese",lang:"pt-BR",fallbackvoice:!0,service:"g2"},{name:"Joana Compact"},{name:"Joana"},{name:"pt-PT",rate:.25},{name:"Fallback Portuguese",lang:"pt-PT",fallbackvoice:!0},{name:"Fallback Serbo-Croation",lang:"sh",fallbackvoice:!0,service:"g2"},{name:"Laura Compact"},{name:"Laura"},{name:"sk-SK",rate:.25},{name:"Fallback Slovak",lang:"sk",fallbackvoice:!0,service:"g2"},{name:"Javier Compact"},{name:"Paulina"},{name:"es-MX",rate:.25},
        {name:"Fallback Spanish (Latin American)",lang:"es-419",fallbackvoice:!0,service:"g2"},{name:"Fallback Swahili",lang:"sw",fallbackvoice:!0},{name:"Fallback Tamil",lang:"ta",fallbackvoice:!0},{name:"Narisa Compact"},{name:"Kanya"},{name:"th-TH",rate:.25},{name:"Fallback Thai",lang:"th",fallbackvoice:!0},{name:"Fallback Vietnamese",lang:"vi",fallbackvoice:!0},{name:"Fallback Welsh",lang:"cy",fallbackvoice:!0},{name:"Oskar Compact"},{name:"sv-SE",rate:.25},{name:"Simona Compact"},{name:"Ioana"},{name:"ro-RO",
        rate:.25},{name:"Kyoko"},{name:"Lekha"},{name:"Ting-Ting"},{name:"Yuna"},{name:"Xander Compact"},{name:"nl-NL",rate:.25},{name:"Fallback UK English Male",lang:"en-GB",fallbackvoice:!0,service:"g1",voicename:"rjs"},{name:"Finnish Male",lang:"fi",fallbackvoice:!0,service:"g1",voicename:""},{name:"Czech Male",lang:"cs",fallbackvoice:!0,service:"g1",voicename:""},{name:"Danish Male",lang:"da",fallbackvoice:!0,service:"g1",voicename:""},{name:"Greek Male",lang:"el",fallbackvoice:!0,service:"g1",voicename:"",
        rate:.25},{name:"Hungarian Male",lang:"hu",fallbackvoice:!0,service:"g1",voicename:""},{name:"Latin Male",lang:"la",fallbackvoice:!0,service:"g1",voicename:""},{name:"Norwegian Male",lang:"no",fallbackvoice:!0,service:"g1",voicename:""},{name:"Slovak Male",lang:"sk",fallbackvoice:!0,service:"g1",voicename:""},{name:"Swedish Male",lang:"sv",fallbackvoice:!0,service:"g1",voicename:""},{name:"Fallback US English Male",lang:"en",fallbackvoice:!0,service:"tts-api",voicename:""},{name:"German Germany",
        lang:"de_DE"},{name:"English United Kingdom",lang:"en_GB"},{name:"English India",lang:"en_IN"},{name:"English United States",lang:"en_US"},{name:"Spanish Spain",lang:"es_ES"},{name:"Spanish Mexico",lang:"es_MX"},{name:"Spanish United States",lang:"es_US"},{name:"French Belgium",lang:"fr_BE"},{name:"French France",lang:"fr_FR"},{name:"Hindi India",lang:"hi_IN"},{name:"Indonesian Indonesia",lang:"in_ID"},{name:"Italian Italy",lang:"it_IT"},{name:"Japanese Japan",lang:"ja_JP"},{name:"Korean South Korea",
        lang:"ko_KR"},{name:"Dutch Netherlands",lang:"nl_NL"},{name:"Polish Poland",lang:"pl_PL"},{name:"Portuguese Brazil",lang:"pt_BR"},{name:"Portuguese Portugal",lang:"pt_PT"},{name:"Russian Russia",lang:"ru_RU"},{name:"Thai Thailand",lang:"th_TH"},{name:"Turkish Turkey",lang:"tr_TR"},{name:"Chinese China",lang:"zh_CN_#Hans"},{name:"Chinese Hong Kong",lang:"zh_HK_#Hans"},{name:"Chinese Hong Kong",lang:"zh_HK_#Hant"},{name:"Chinese Taiwan",lang:"zh_TW_#Hant"},{name:"Alex"},{name:"Maged",lang:"ar-SA"},
        {name:"Zuzana",lang:"cs-CZ"},{name:"Sara",lang:"da-DK"},{name:"Anna",lang:"de-DE"},{name:"Melina",lang:"el-GR"},{name:"Karen",lang:"en-AU"},{name:"Daniel",lang:"en-GB"},{name:"Moira",lang:"en-IE"},{name:"Samantha (Enhanced)",lang:"en-US"},{name:"Samantha",lang:"en-US"},{name:"Tessa",lang:"en-ZA"},{name:"Monica",lang:"es-ES"},{name:"Paulina",lang:"es-MX"},{name:"Satu",lang:"fi-FI"},{name:"Amelie",lang:"fr-CA"},{name:"Thomas",lang:"fr-FR"},{name:"Carmit",lang:"he-IL"},{name:"Lekha",lang:"hi-IN"},{name:"Mariska",
        lang:"hu-HU"},{name:"Damayanti",lang:"id-ID"},{name:"Alice",lang:"it-IT"},{name:"Kyoko",lang:"ja-JP"},{name:"Yuna",lang:"ko-KR"},{name:"Ellen",lang:"nl-BE"},{name:"Xander",lang:"nl-NL"},{name:"Nora",lang:"no-NO"},{name:"Zosia",lang:"pl-PL"},{name:"Luciana",lang:"pt-BR"},{name:"Joana",lang:"pt-PT"},{name:"Ioana",lang:"ro-RO"},{name:"Milena",lang:"ru-RU"},{name:"Laura",lang:"sk-SK"},{name:"Alva",lang:"sv-SE"},{name:"Kanya",lang:"th-TH"},{name:"Yelda",lang:"tr-TR"},{name:"Ting-Ting",lang:"zh-CN"},{name:"Sin-Ji",
        lang:"zh-HK"},{name:"Mei-Jia",lang:"zh-TW"},{name:"Microsoft David Mobile - English (United States)",lang:"en-US"},{name:"Microsoft Zira Mobile - English (United States)",lang:"en-US"},{name:"Microsoft Mark Mobile - English (United States)",lang:"en-US"},{name:"native",lang:""},{name:"Google espa\u00f1ol"},{name:"Google espa\u00f1ol de Estados Unidos"},{name:"Google fran\u00e7ais"},{name:"Google Bahasa Indonesia"},{name:"Google italiano"},{name:"Google Nederlands"},{name:"Google polski"},{name:"Google portugu\u00eas do Brasil"},
        {name:"Google \u0440\u0443\u0441\u0441\u043a\u0438\u0439"},{name:"Google \u0939\u093f\u0928\u094d\u0926\u0940"},{name:"Google \u65e5\u672c\u8a9e"},{name:"Google \u666e\u901a\u8bdd\uff08\u4e2d\u56fd\u5927\u9646\uff09"},{name:"Google \u7ca4\u8a9e\uff08\u9999\u6e2f\uff09"},{name:"zh-HK",rate:.25},{name:"Fallback Chinese (Hong Kong) Female",lang:"zh-HK",fallbackvoice:!0,service:"g1"},{name:"Google \u7ca4\u8a9e\uff08\u9999\u6e2f\uff09"},{name:"zh-TW",rate:.25},{name:"Fallback Chinese (Taiwan) Female",
        lang:"zh-TW",fallbackvoice:!0,service:"g1"},{name:"Microsoft George Mobile - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Susan Mobile - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Hazel Mobile - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Heera Mobile - English (India)",lang:"en-In"},{name:"Microsoft Irina Mobile - Russian (Russia)",lang:"ru-RU"},{name:"Microsoft Hedda Mobile - German (Germany)",lang:"de-DE"},{name:"Microsoft Katja Mobile - German (Germany)",
        lang:"de-DE"},{name:"Microsoft Helena Mobile - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Laura Mobile - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Sabina Mobile - Spanish (Mexico)",lang:"es-MX"},{name:"Microsoft Julie Mobile - French (France)",lang:"fr-FR"},{name:"Microsoft Paulina Mobile - Polish (Poland)",lang:"pl-PL"},{name:"Microsoft Huihui Mobile - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Yaoyao Mobile - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Tracy Mobile - Chinese (Traditional, Hong Kong S.A.R.)",
        lang:"zh-CN"},{name:"Microsoft Elsa Mobile - Italian (Italy)",lang:"it-IT"},{name:"Microsoft Maria Mobile - Portuguese (Brazil)",lang:"pt-BR"},{name:"Microsoft Ayumi Mobile - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Haruka Mobile - Japanese (Japan)",lang:"ja-JP"},{name:"Helena",lang:"de-DE"},{name:"Catherine",lang:"en-AU"},{name:"Arthur",lang:"en-GB"},{name:"Martha",lang:"en-GB"},{name:"Marie",lang:"fr-FR"},{name:"O-ren",lang:"ja-JP"},{name:"Yu-shu",lang:"zh-CN"},{name:"Microsoft David - English (United States)",
        lang:"en-US"},{name:"Microsoft Zira - English (United States)",lang:"en-US"},{name:"Microsoft Mark - English (United States)",lang:"en-US"},{name:"Microsoft George - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Susan - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Hazel - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Heera - English (India)",lang:"en-In"},{name:"Microsoft Irina - Russian (Russia)",lang:"ru-RU"},{name:"Microsoft Hedda - German (Germany)",lang:"de-DE"},
        {name:"Microsoft Katja - German (Germany)",lang:"de-DE"},{name:"Microsoft Helena - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Laura - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Sabina - Spanish (Mexico)",lang:"es-MX"},{name:"Microsoft Julie - French (France)",lang:"fr-FR"},{name:"Microsoft Paulina - Polish (Poland)",lang:"pl-PL"},{name:"Microsoft Huihui - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Yaoyao - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Tracy - Chinese (Traditional, Hong Kong S.A.R.)",
        lang:"zh-CN"},{name:"Microsoft Elsa - Italian (Italy)",lang:"it-IT"},{name:"Microsoft Maria - Portuguese (Brazil)",lang:"pt-BR"},{name:"Microsoft Ayumi - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Haruka - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Hortense - French (France)",lang:"fr-FR"},{name:"Microsoft Hanhan - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft Heami - Korean (Korean)",lang:"ko-KR"},{name:"Microsoft Stefan - German (Germany)",lang:"de-DE"},{name:"Microsoft Ravi - English (India)",
        lang:"en-IN"},{name:"Microsoft Pablo - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Raul - Spanish (Mexico)",lang:"es-MX"},{name:"Microsoft Paul - French (France)",lang:"fr-FR"},{name:"Microsoft Cosimo - Italian (Italy)",lang:"it-IT"},{name:"Microsoft Ichiro - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Adam - Polish (Poland)",lang:"pl-PL"},{name:"Microsoft Daniel - Portuguese (Brazil)",lang:"pt-BR"},{name:"Microsoft Pavel - Russian (Russia)",lang:"ru-RU"},{name:"Microsoft Kangkang - Chinese (Simplified, PRC)",
        lang:"zh-CN"},{name:"Microsoft Danny - Chinese (Traditional, Hong Kong S.A.R.)",lang:"zh-HK"},{name:"Microsoft Yating - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft Zhiwei - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft Hortense Mobile - French (France)",lang:"fr-FR"},{name:"Microsoft Hanhan Mobile - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft Heami Mobile - Korean (Korean)",lang:"ko-KR"},{name:"Microsoft Stefan Mobile - German (Germany)",lang:"de-DE"},
        {name:"Microsoft Ravi Mobile - English (India)",lang:"en-IN"},{name:"Microsoft Pablo Mobile - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Raul Mobile - Spanish (Mexico)",lang:"es-MX"},{name:"Microsoft Paul Mobile - French (France)",lang:"fr-FR"},{name:"Microsoft Cosimo Mobile - Italian (Italy)",lang:"it-IT"},{name:"Microsoft Ichiro Mobile - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Adam Mobile - Polish (Poland)",lang:"pl-PL"},{name:"Microsoft Daniel Mobile - Portuguese (Brazil)",lang:"pt-BR"},
        {name:"Microsoft Pavel Mobile - Russian (Russia)",lang:"ru-RU"},{name:"Microsoft Kangkang Mobile - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Danny Mobile - Chinese (Traditional, Hong Kong S.A.R.)",lang:"zh-HK"},{name:"Microsoft Yating Mobile - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft Zhiwei Mobile - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft David Desktop - English (United States)",lang:"en-US"},{name:"Microsoft Zira Desktop - English (United States)",
        lang:"en-US"},{name:"Microsoft Mark Desktop - English (United States)",lang:"en-US"},{name:"Microsoft George Desktop - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Susan Desktop - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Hazel Desktop - English (United Kingdom)",lang:"en-GB"},{name:"Microsoft Heera Desktop - English (India)",lang:"en-In"},{name:"Microsoft Irina Desktop - Russian (Russia)",lang:"ru-RU"},{name:"Microsoft Hedda Desktop - German (Germany)",lang:"de-DE"},{name:"Microsoft Katja Desktop - German (Germany)",
        lang:"de-DE"},{name:"Microsoft Helena Desktop - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Laura Desktop - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Sabina Desktop - Spanish (Mexico)",lang:"es-MX"},{name:"Microsoft Julie Desktop - French (France)",lang:"fr-FR"},{name:"Microsoft Paulina Desktop - Polish (Poland)",lang:"pl-PL"},{name:"Microsoft Huihui Desktop - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Yaoyao Desktop - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Tracy Desktop - Chinese (Traditional, Hong Kong S.A.R.)",
        lang:"zh-CN"},{name:"Microsoft Elsa Desktop - Italian (Italy)",lang:"it-IT"},{name:"Microsoft Maria Desktop - Portuguese (Brazil)",lang:"pt-BR"},{name:"Microsoft Ayumi Desktop - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Haruka Desktop - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Hortense Desktop - French (France)",lang:"fr-FR"},{name:"Microsoft Hanhan Desktop - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft Heami Desktop - Korean (Korean)",lang:"ko-KR"},{name:"Microsoft Stefan Desktop - German (Germany)",
        lang:"de-DE"},{name:"Microsoft Ravi Desktop - English (India)",lang:"en-IN"},{name:"Microsoft Pablo Desktop - Spanish (Spain)",lang:"es-ES"},{name:"Microsoft Raul Desktop - Spanish (Mexico)",lang:"es-MX"},{name:"Microsoft Paul Desktop - French (France)",lang:"fr-FR"},{name:"Microsoft Cosimo Desktop - Italian (Italy)",lang:"it-IT"},{name:"Microsoft Ichiro Desktop - Japanese (Japan)",lang:"ja-JP"},{name:"Microsoft Adam Desktop - Polish (Poland)",lang:"pl-PL"},{name:"Microsoft Daniel Desktop - Portuguese (Brazil)",
        lang:"pt-BR"},{name:"Microsoft Pavel Desktop - Russian (Russia)",lang:"ru-RU"},{name:"Microsoft Kangkang Desktop - Chinese (Simplified, PRC)",lang:"zh-CN"},{name:"Microsoft Danny Desktop - Chinese (Traditional, Hong Kong S.A.R.)",lang:"zh-HK"},{name:"Microsoft Yating Desktop - Chinese (Traditional, Taiwan)",lang:"zh-TW"},{name:"Microsoft Zhiwei Desktop - Chinese (Traditional, Taiwan)",lang:"zh-TW"}];
        
        self.iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
        
        //Fallback cache voices
        var cache_ios_voices = [{"name":"he-IL","voiceURI":"he-IL","lang":"he-IL"},{"name":"th-TH","voiceURI":"th-TH","lang":"th-TH"},{"name":"pt-BR","voiceURI":"pt-BR","lang":"pt-BR"},{"name":"sk-SK","voiceURI":"sk-SK","lang":"sk-SK"},{"name":"fr-CA","voiceURI":"fr-CA","lang":"fr-CA"},{"name":"ro-RO","voiceURI":"ro-RO","lang":"ro-RO"},{"name":"no-NO","voiceURI":"no-NO","lang":"no-NO"},{"name":"fi-FI","voiceURI":"fi-FI","lang":"fi-FI"},{"name":"pl-PL","voiceURI":"pl-PL","lang":"pl-PL"},{"name":"de-DE","voiceURI":"de-DE","lang":"de-DE"},{"name":"nl-NL","voiceURI":"nl-NL","lang":"nl-NL"},{"name":"id-ID","voiceURI":"id-ID","lang":"id-ID"},{"name":"tr-TR","voiceURI":"tr-TR","lang":"tr-TR"},{"name":"it-IT","voiceURI":"it-IT","lang":"it-IT"},{"name":"pt-PT","voiceURI":"pt-PT","lang":"pt-PT"},{"name":"fr-FR","voiceURI":"fr-FR","lang":"fr-FR"},{"name":"ru-RU","voiceURI":"ru-RU","lang":"ru-RU"},{"name":"es-MX","voiceURI":"es-MX","lang":"es-MX"},{"name":"zh-HK","voiceURI":"zh-HK","lang":"zh-HK"},{"name":"sv-SE","voiceURI":"sv-SE","lang":"sv-SE"},{"name":"hu-HU","voiceURI":"hu-HU","lang":"hu-HU"},{"name":"zh-TW","voiceURI":"zh-TW","lang":"zh-TW"},{"name":"es-ES","voiceURI":"es-ES","lang":"es-ES"},{"name":"zh-CN","voiceURI":"zh-CN","lang":"zh-CN"},{"name":"nl-BE","voiceURI":"nl-BE","lang":"nl-BE"},{"name":"en-GB","voiceURI":"en-GB","lang":"en-GB"},{"name":"ar-SA","voiceURI":"ar-SA","lang":"ar-SA"},{"name":"ko-KR","voiceURI":"ko-KR","lang":"ko-KR"},{"name":"cs-CZ","voiceURI":"cs-CZ","lang":"cs-CZ"},{"name":"en-ZA","voiceURI":"en-ZA","lang":"en-ZA"},{"name":"en-AU","voiceURI":"en-AU","lang":"en-AU"},{"name":"da-DK","voiceURI":"da-DK","lang":"da-DK"},{"name":"en-US","voiceURI":"en-US","lang":"en-US"},{"name":"en-IE","voiceURI":"en-IE","lang":"en-IE"},{"name":"hi-IN","voiceURI":"hi-IN","lang":"hi-IN"},{"name":"el-GR","voiceURI":"el-GR","lang":"el-GR"},{"name":"ja-JP","voiceURI":"ja-JP","lang":"ja-JP"}];
        

        var systemvoices;

        var CHARACTER_LIMIT = 100;
        var VOICESUPPORT_ATTEMPTLIMIT = 5;
        var voicesupport_attempts = 0;
        var fallbackMode = false;
        var WORDS_PER_MINUTE = 140;

        self.fallback_playing = false;
        self.fallback_parts = null;
        self.fallback_part_index = 0;
        self.fallback_audio = null;
        self.msgparameters = null;
        self.timeoutId = null;
        self.OnLoad_callbacks = [];

        //Wait until system voices are ready and trigger the event OnVoiceReady
        if (typeof speechSynthesis != 'undefined') {
            speechSynthesis.onvoiceschanged = function () {

                systemvoices = window.speechSynthesis.getVoices();
                console.log('systemvoices');
                console.log(systemvoices);
                if (self.OnVoiceReady != null) {
                    self.OnVoiceReady.call();
                }
            };
        }

        self.default_rv = speechVoices[7];



        self.OnVoiceReady = null;


        self.init = function() {
            
            //Disable RV on IOS temporally
            /*if (self.iOS) {
                self.enableFallbackMode();
                return;
            }*/


            if (typeof speechSynthesis === 'undefined') {

                console.log('RV: Voice synthesis not supported');
                self.enableFallbackMode();
                
                

            } else {


                //Waiting a few ms before calling getVoices() fixes some issues with safari on IOS as well as Chrome
                setTimeout(function () {
                    var gsvinterval = setInterval(function () {

                        var v = window.speechSynthesis.getVoices();

                        if (v.length == 0 && (systemvoices == null || systemvoices.length == 0)) {
                            //console.log('Voice support NOT ready');

                            voicesupport_attempts++;
                            if (voicesupport_attempts > VOICESUPPORT_ATTEMPTLIMIT) {
                                
                                clearInterval(gsvinterval);
                                
                                //On IOS, sometimes getVoices is just empty, but speech works. So we use a cached voice collection.
                                if (window.speechSynthesis != null) {
                                    
                                    if (self.iOS) {
                                        
                                        console.log('RV: Voice support ready (cached)');
                                        self.systemVoicesReady(cache_ios_voices);
                                        
                                    }else{
                                        
                                        console.log("RV: speechSynthesis present but no system voices found");
                                        self.enableFallbackMode();
                                    }
                                    
                                } else {
                                
                                    //We don't support voices. Using fallback
                                    self.enableFallbackMode();
                                }
                            }

                        } else {

                            console.log('RV: Voice support ready');
                            self.systemVoicesReady(v);
                            
                            clearInterval(gsvinterval);

                        }

                    }, 100);
                }, 100);
            }
            
            self.Dispatch("OnLoad");
        }

        self.systemVoicesReady = function(v) {
            systemvoices = v;

            self.mapRVs();

            if (self.OnVoiceReady != null)
                self.OnVoiceReady.call();            
        }

        self.enableFallbackMode = function() {

            fallbackMode = true;
            console.log('RV: Enabling fallback mode');

            self.mapRVs();

            if (self.OnVoiceReady != null)
                self.OnVoiceReady.call();


        }


        self.getVoices = function () {

            //Create voices array

            var v = [];

            for (var i = 0; i < speechVoices.length; i++) {
                v.push({name: speechVoices[i].name});
            }

            return v;

        }


        self.speak = function (text, voicename, parameters) {

            self.msgparameters = parameters ||  {};
            self.msgtext = text;
            self.msgvoicename = voicename;

            //Support for multipart text (there is a limit on characters)
            var multipartText = [];

            if (text.length > CHARACTER_LIMIT) {

                var tmptxt = text;

                while (tmptxt.length > CHARACTER_LIMIT) {

                    //Split by common phrase delimiters
                    var p = tmptxt.search(/[:!?.;]+/);
                    var part = '';

                    //Coludn't split by priority characters, try commas
                    if (p == -1 || p >= CHARACTER_LIMIT) {
                        p = tmptxt.search(/[,]+/);
                    }

                    //Couldn't split by normal characters, then we use spaces
                    if (p == -1 || p >= CHARACTER_LIMIT) {

                        var words = tmptxt.split(' ');

                        for (var i = 0; i < words.length; i++) {

                            if (part.length + words[i].length + 1 > CHARACTER_LIMIT)
                                break;

                            part += (i != 0 ? ' ' : '') + words[i];

                        }

                    } else {

                        part = tmptxt.substr(0, p + 1);

                    }

                    tmptxt = tmptxt.substr(part.length, tmptxt.length - part.length);

                    multipartText.push(part);
                    //console.log(part.length + " - " + part);

                }

                //Add the remaining text
                if (tmptxt.length > 0) {
                    multipartText.push(tmptxt);
                }

            } else {

                //Small text
                multipartText.push(text);
            }


            //Find system voice that matches voice name
            var rv;

            if (voicename == null) {
                rv = self.default_rv;
            } else {
                rv = self.getResponsiveVoice(voicename);
            }

            var profile = {};




            //Map was done so no need to look for the mapped voice
            if (rv.mappedProfile != null) {

                profile = rv.mappedProfile;

            } else {

                profile.systemvoice = self.getMatchedVoice(rv);
                profile.collectionvoice = {};

                if (profile.systemvoice == null) {
                    console.log('RV: ERROR: No voice found for: ' + voicename);
                    return;
                }
            }


            if (profile.collectionvoice.fallbackvoice == true) {
                fallbackMode = true;
                self.fallback_parts = [];
            } else {
                fallbackMode = false;
            }
            
            self.msgprofile = profile;
            //console.log("Start multipart play");

            //Play multipart text
            for (var i = 0; i < multipartText.length; i++) {

                if (!fallbackMode) {
                    //Use SpeechSynthesis

                    //Create msg object
                    var msg = new SpeechSynthesisUtterance();
                    msg.voice = profile.systemvoice;
                    msg.voiceURI = profile.systemvoice.voiceURI;
                    msg.volume = profile.collectionvoice.volume || profile.systemvoice.volume || 1; // 0 to 1
                    msg.rate = profile.collectionvoice.rate || profile.systemvoice.rate || 1; // 0.1 to 10
                    msg.pitch = profile.collectionvoice.pitch || profile.systemvoice.pitch || 1; //0 to 2*/
                    msg.text = multipartText[i];
                    msg.lang = profile.collectionvoice.lang || profile.systemvoice.lang;
                    msg.rvIndex = i;
                    msg.rvTotal = multipartText.length;
                    
                    if (i == 0) {
                        msg.onstart = self.speech_onstart;
                    }        
                    self.msgparameters.onendcalled = false;
                    
                    if (parameters != null) {

                        

                        if (i < multipartText.length - 1 && multipartText.length > 1) {
                            msg.onend = parameters.onchunkend;
                            msg.addEventListener('end',parameters.onchuckend);
                        } else {
                            msg.onend = self.speech_onend;
                            msg.addEventListener('end',self.speech_onend);
                        }



                        msg.onerror = parameters.onerror || function (e) {
                            console.log('RV: Error');
                            console.log(e);
                        };
                        
                        msg.onpause = parameters.onpause;
                        msg.onresume = parameters.onresume;
                        msg.onmark = parameters.onmark;
                        msg.onboundary = parameters.onboundary;
                    } else {
                        msg.onend = self.speech_onend;
                        msg.onerror = function (e) {
                            console.log('RV: Error');
                            console.log(e);
                        };
                    }
                    //console.log(JSON.stringify(msg));				
                    speechSynthesis.speak(msg);

                } else {
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    //var url = 'http://www.corsproxy.com/translate.google.com/translate_tts?ie=UTF-8&q=' + multipartText[i] + '&tl=' + profile.collectionvoice.lang || profile.systemvoice.lang || 'en-US';
                    var url = 'http://responsivevoice.org/responsivevoice/getvoice.php?t=' + multipartText[i]+ '&tl=' + profile.collectionvoice.lang || profile.systemvoice.lang || 'en-US';
                    var audio = document.createElement("AUDIO");
                    audio.src = url;
                    audio.playbackRate = 1;
                    audio.preload = 'auto';
                    audio.volume = profile.collectionvoice.volume || profile.systemvoice.volume || 1; // 0 to 1;
                    self.fallback_parts.push(audio);
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log('woooooooooo');
                    console.log(audio);
                    audioList.push(audio);


                }


            }

            if (fallbackMode) {


                self.fallback_part_index = 0;
                self.fallback_startPart();

            }

        }

        self.startTimeout = function (text, callback) {
            
           //if (self.iOS) {
            //   multiplier = 0.5;
           //}

           var multiplier = self.msgprofile.collectionvoice.timerSpeed;
           if (self.msgprofile.collectionvoice.timerSpeed==null)
               multiplier = 1;
            
           //console.log(self.msgprofile.collectionvoice.name);
           if (multiplier <=0)
               return;
           
            self.timeoutId = setTimeout(callback, multiplier * 1000 * (60 / WORDS_PER_MINUTE) * text.split(/\s+/).length); //avg 140 words per minute read time            
            //console.log("Timeout " + self.timeoutId + " started: " + (multiplier * 1000 * (60 / WORDS_PER_MINUTE) * text.split(/\s+/).length).toString());            
        }

        self.checkAndCancelTimeout = function () {
            if (self.timeoutId != null) {
                //console.log("Timeout " + self.timeoutId + " cancelled");
                clearTimeout(self.timeoutId);
                self.timeoutId = null;
            }
        }

        self.speech_timedout = function() {
            //console.log("Speech cancelled: Timeout " + self.timeoutId + " ended");
            self.cancel();
            //if (!self.iOS) //On iOS, cancel calls msg.onend 
                self.speech_onend();
            
        }

        self.speech_onend = function () {
            self.checkAndCancelTimeout();
            
            //Avoid this being automatically called just after calling speechSynthesis.cancel
            if (self.cancelled === true) {
                self.cancelled = false;
                return;
            }
            
            //console.log("on end fired");
            if (self.msgparameters != null && self.msgparameters.onend != null && self.msgparameters.onendcalled!=true) {
                //console.log("Speech on end called  -" + self.msgtext);
                self.msgparameters.onendcalled=true;
                self.msgparameters.onend();
                
            } 

        }

        self.speech_onstart = function () {
            //if (!self.iOS)
            //console.log("Speech start");
            if (self.iOS)
                self.startTimeout(self.msgtext,self.speech_timedout);
            
            self.msgparameters.onendcalled=false;
            if (self.msgparameters != null && self.msgparameters.onstart != null) {
                self.msgparameters.onstart();
            }

        }



        self.fallback_startPart = function () {

            if (self.fallback_part_index == 0) {
                self.speech_onstart();
            }
            
            self.fallback_audio = self.fallback_parts[self.fallback_part_index];
            
            if (self.fallback_audio == null) {

                //Fallback audio is not working. Just wait for the timeout event
                console.log("RV: Fallback Audio is not available");

            } else {
                
                self.fallback_audio.play();
                self.fallback_audio.addEventListener('ended', self.fallback_finishPart);
            }
        }

        self.fallback_finishPart = function (e) {

            self.checkAndCancelTimeout();

            if (self.fallback_part_index < self.fallback_parts.length - 1) {
                //console.log('chunk ended');
                self.fallback_part_index++;
                self.fallback_startPart();

            } else {
                //console.log('msg ended');
                self.speech_onend();

            }

        }


        self.cancel = function () {

            self.checkAndCancelTimeout();

            if (fallbackMode){
                if (self.fallback_audio!=null)
                    self.fallback_audio.pause();
            }else{
                self.cancelled = true;
                speechSynthesis.cancel();

            }
        }


        self.voiceSupport = function () {

            return ('speechSynthesis' in window);

        }

        self.OnFinishedPlaying = function (event) {
            //console.log("OnFinishedPlaying");
            if (self.msgparameters != null) {
                if (self.msgparameters.onend != null)
                    self.msgparameters.onend();
            }

        }

        //Set default voice to use when no voice name is supplied to speak()
        self.setDefaultVoice = function (voicename) {

            var vr = self.getResponsiveVoice(voicename);

            if (vr != null) {
                self.default_vr = vr;
            }

        }

        //Map speechVoices to system voices
        self.mapRVs = function() {

            for (var i = 0; i < speechVoices.length; i++) {

                var rv = speechVoices[i];

                for (var j = 0; j < rv.voiceIDs.length; j++) {

                    var vcoll = voicecollection[rv.voiceIDs[j]];

                    if (vcoll.fallbackvoice != true) {		// vcoll.fallbackvoice would be null instead of false

                        // Look on system voices
                        var v = self.getSystemVoice(vcoll.name);
                        if (v != null) {
                            rv.mappedProfile = {
                                systemvoice: v,
                                collectionvoice: vcoll
                            };
                            //console.log("Mapped " + rv.name + " to " + v.name);
                            break;
                        }

                    } else {

                        //Pick the fallback voice
                        rv.mappedProfile = {
                            systemvoice: {},
                            collectionvoice: vcoll
                        };
                        //console.log("Mapped " + rv.name + " to " + vcoll.lang + " fallback voice");
                        break;

                    }
                }
            }


        }


        //Look for the voice in the system that matches the one in our collection
        self.getMatchedVoice = function(rv) {

            for (var i = 0; i < rv.voiceIDs.length; i++) {
                var v = self.getSystemVoice(voicecollection[rv.voiceIDs[i]].name);
                if (v != null)
                    return v;
            }

            return null;

        }

        self.getSystemVoice = function(name) {

            if (typeof systemvoices === 'undefined')
                return null;

            for (var i = 0; i < systemvoices.length; i++) {
                if (systemvoices[i].name == name)
                    return systemvoices[i];
            }

            return null;

        }

        self.getResponsiveVoice = function(name) {

            for (var i = 0; i < speechVoices.length; i++) {
                if (speechVoices[i].name == name) {
                    return speechVoices[i];
                }
            }

            return null;

        }
        
        self.Dispatch = function(name) {
            
            if (self.hasOwnProperty(name + "_callbacks") && 
                self[name + "_callbacks"].length > 0) {
                var callbacks = self[name + "_callbacks"];
                for(var i=0; i<callbacks.length; i++) {
                    callbacks[i]();
                }
                
            }
        }
        
        self.AddEventListener = function(name,callback) {
            if (self.hasOwnProperty(name + "_callbacks")) {
                self[name + "_callbacks"].push(callback);
            }else{
                console.log("RV: Event listener not found: " + name);
            }
        }
        
        
        
        //We should use jQuery if it's available
        if (typeof $ === 'undefined') {
            document.addEventListener('DOMContentLoaded', function () {
                self.init();
            });
        } else {

            $(document).ready(function () {
                self.init();
            });
        }        
        

    }
    var speechVoices = new Speech();
}
