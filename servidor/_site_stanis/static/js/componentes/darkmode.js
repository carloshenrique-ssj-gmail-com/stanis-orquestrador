const html = document.querySelector("html")

const getStyle = (element, style) => 
    window
        .getComputedStyle(element)
        .getPropertyValue(style)


const initialColors = {
    bg: getStyle(html, "--bg"),
    bg2: getStyle(html, "--bg2"),
    bg3: getStyle(html, "--bg3"),
    bg4: getStyle(html, "--bg4"),
    bgh: getStyle(html, "--bgh"),
    bgtext: getStyle(html, "--bgtext"),
    fonttext: getStyle(html, "--fonttext"),
    fonttext2: getStyle(html, "--fonttext2")
}

const darkMode = {
    bg: "#131314",
    bg2: "#444746",
    bg3: "#1C1C1C",
    bg4: "#333333",
    bgh:"#333333",
    bgtext: "#808080",
    fonttext: "white",
    fonttext2: "#d1d1d6"
}

const transformKey = key => 
    "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()


const changeColors = (colors) => {
    Object.keys(colors).map(key => 
        html.style.setProperty(transformKey(key), colors[key]) 
    )
}

function alterarTema(){
   let ckb = document.querySelector("input[name=tema]")
   let lbl = document.querySelector("#vDark001")
   if (ckb.checked == 1){
      changeColors(darkMode);
      setCookie('dark_mode_orquestrador',1);
   }else{
      changeColors(initialColors);
      setCookie('dark_mode_orquestrador',0);
   }
}


if (getCookie('dark_mode_orquestrador') == 1){
    changeColors(darkMode);
    setCookie('dark_mode_orquestrador',1);
    document.querySelector("#vDark001").innerHTML = "<strong>Normal</strong>";
}else{
    changeColors(initialColors);
    setCookie('dark_mode_orquestrador',0);
    document.querySelector("#vDark001").innerHTML = "<strong>Dark</strong>";
}

function setCookie(name, value, duration) {
    var cookie = name + "=" + escape(value) +
    ((duration) ? "; duration=" + duration.toGMTString() : "");
    document.cookie = cookie;
}

function getCookie(name) {
    var cookies = document.cookie;
    var prefix = name + "=";
    var begin = cookies.indexOf("; " + prefix);
 
    if (begin == -1) {
 
        begin = cookies.indexOf(prefix);
         
        if (begin != 0) {
            return null;
        }
 
    } else {
        begin += 2;
    }
 
    var end = cookies.indexOf(";", begin);
     
    if (end == -1) {
        end = cookies.length;                        
    }
 
    return unescape(cookies.substring(begin + prefix.length, end));
}
function deleteCookie(name) {
    if (getCookie(name)) {
           document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}