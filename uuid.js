"use strict";
import { Base64 } from "https://cdn.jsdelivr.net/npm/js-base64@3.7.3/base64.mjs";
import Alpine from "alpinejs";
window.Alpine = Alpine;
Alpine.start();
let uuid = "";
let links = [];
let output = [];
const button = document.querySelector(".button");
const copy = document.querySelector(".Copy");
const multiline = document.querySelector(".multiline");
const linksTextArea = document.getElementById("links");
const uuidInput = document.getElementById("uuid");

function changeUuid(link, uuid) {
  const protocol = link.split("://")[0];
  const body = link.split("://")[1];
  if (protocol === "vless") {
    let newLink;
    let linkParts = body.split("@");
    linkParts[0] = uuid;
    newLink = `${protocol}://${linkParts[0]}@${linkParts[1]}`;
    return newLink;
  }
  if (protocol === "vmess") {
    let newLink;
    let strConfigDiscrition = Base64.decode(body);
    let confJson = JSON.parse(strConfigDiscrition);
    confJson.id = uuid;
    strConfigDiscrition = Base64.encode(JSON.stringify(confJson));
    newLink = `${protocol}://${strConfigDiscrition}`;
    return newLink;
  }
}

function textareaValue() {
  uuid = uuidInput.value.trim();
  links = linksTextArea.value.trim().split("\n");
  for (let link of links) {
    output.push(changeUuid(link, uuid));
  }
  multiline.insertAdjacentText("afterbegin", output.join("\r\n"));
}

button.addEventListener("click", (e) => textareaValue());

copy.addEventListener(
  "click",

  (e) => {
    const text = output.join("\r\n");
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }
);
