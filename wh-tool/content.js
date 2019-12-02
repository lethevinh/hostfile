
function request(barcode) {
    let url = 'https://30.126.11.13/';
    return $.get(url + "api/v1/wh-package-suggestion-box", { barcode });
}

function renderImage(image) {
    let containerImage = $('#container > div > div.op-row.op-layout-row > div.op-col.op-col-6 > div');
    let box = containerImage.find('#box-image-container');
    var imgURL = chrome.extension.getURL("images/box/" + image.name + ".jpg");
    img = document.createElement('img');
    img.src = imgURL;
    img.width = 200;
    img.height = 200;
    box.html(img)
}

function renderImageBoby(image) {
    let container = $('.outbound-tool');
    var imgURL = chrome.extension.getURL("images/box-net/" + image.name + ".jpg");
    img = document.createElement('img');
    img.src = imgURL;
    // img.width = 200;
    img.height = 200;
    container.find('.content').html(img)
}

async function handleRequest(barcode) {
    let data = await request(barcode).fail((error) => {
        return error.responseJSON;
    });
    if (data) {
        renderImageBoby(data.data);
    }
    window.outboud = { barcode: [], total: 0 };
}

function handle(barcode, qty) {
    window.outboud.barcode.push(barcode);
    let count = document.querySelector("#container > div > div.op-row.op-layout-row > div.op-col.op-col-13 > div > div.op-col.op-col-scroll > div > div.op-standard-item-list.op-standard-item-list-normal.op-standard-item-list-normal-1 > div.op-standard-item-list-hd.op-standard-item-list-hd-13a.op-standard-item-list-hd-normal-border > div.op-standard-item-list-right > span.op-standard-item-list-statstics");
    let list = count.textContent.split("/");
    if (list.length === 2 && parseInt(list[0]) === (parseInt(list[1]) - 1) && window.outboud.barcode.length > 0) {
        let listbarcode = window.outboud.barcode.join(',');
        if (listbarcode !== "") {
            handleRequest(listbarcode);
            window.outboud.barcode = [];
        }
    }
}

function handleCheckBarcode(barcode, qty) {
    window.outboud.barcode.push(barcode);
    let elCount = document.querySelector("#container > div > div.op-row.op-layout-row > div.op-col.op-col-13 > div > div.op-col.op-col-scroll > div > div.op-standard-item-list.op-standard-item-list-normal.op-standard-item-list-normal-1 > div.op-standard-item-list-hd.op-standard-item-list-hd-13a.op-standard-item-list-hd-normal-border > div.op-standard-item-list-right > span.op-standard-item-list-statstics");
    let list = elCount.textContent.split("/");

    let listbarcode = "";

    if (list.length === 2 && window.outboud.total === 0) {
        window.outboud.total = parseInt(list[1]);
    }

    if (window.outboud.barcode.length === window.outboud.total) {
        listbarcode = window.outboud.barcode.join(',');
        console.log('Running...' + listbarcode);
        if (listbarcode !== "") {
            handleRequest(listbarcode);
        }
    }
}

function handleTest(barcode, qty) {
    window.outboud.barcode.push(barcode);
    let list = ['1', '3'];
    let listbarcode = "";

    if (window.outboud.total === 0) {
        window.outboud.total = parseInt(list[1]);
    }

    if (window.outboud.barcode.length === window.outboud.total) {
        listbarcode = window.outboud.barcode.join(',');
        console.log('Running...' + listbarcode);
        if (listbarcode !== "") {
            listbarcode = 'FFMVN1003089130,FFMVN1002441308,FFMVN1002713753';
            handleRequest(listbarcode);
        }
    }
}

$(document).ready(() => {
    window.outboud = window.outboud || { barcode: [], total: 0 };
    console.log('Outboud Tool')
    //Add Html
    let containerImage = $('body');
    let container = $(`<div class="outbound-tool" style="position: absolute;top: 120px;left: 70%;z-index: 9999;">
    <div class="title"></div>
    <div class="content"></div></div>`);
    containerImage.prepend(container);

    $(document).scannerDetection({
        timeBeforeScanTest: 200, // wait for the next character for upto 200ms
        avgTimeByChar: 100, // it's not a barcode if a character takes longer than 100ms
        onComplete: handleCheckBarcode
    });
});
