/* made by ponzu */

async function pop(type,color,color2,text,textsize,sizex,sizey,customcss) {
    
    let { v1,v2,v3,v4 } = '';
    switch (type) {
        case 0 : v1 = `position: fixed;top: 0;right: 0;`; v2 = anim1; break;
        case 1 : v1 = `position: fixed;bottom: 0;right: 0;`; v2 = anim1; break;
        default: break;
    }

    const html = `
        <p class="stjs_pop" style='
        ${v1}
        color: #${color};
        background-color: #${color2};
        width: ${sizex};
        height: ${sizey};
        font-size: ${textsize};
        text-align: left;
        animation: ${v2} 1.5s linear forwards;
        ${customcss}
        '>${text}</p>`
    document.getElementById('stjs_pop').innerHTML = html;
    const removepop = function a() {
        document.getElementById('stjs_pop').innerHTML = '';
    }
    setTimeout(removepop,3000)
}