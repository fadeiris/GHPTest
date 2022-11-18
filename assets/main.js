"use strict";

let fetchedSha = "";

document.addEventListener("DOMContentLoaded", async () => {
    fetchedSha = await getSha();

    if (fetchedSha !== "") {
        const liveStreams = getLiveStreams(fetchedSha);

        if (liveStreams !== null && liveStreams.length > 0) {
            createCards(liveStreams);
        } else {
            console.log("livestreams 的值取得失敗。");

            alert("今日無初配信資訊。");
        }
    } else {
        console.log("SHA 值取得失敗。");
    }
});

/**
 * 建立 Card
 *
 * @param {any[]} arrayData  陣列，livestreams 的值。
 */
function createCards(arrayData) {
    const targetElement = document.getElementById("dCardGroup");

    if (targetElement !== undefined && targetElement !== null) {
        for (let i = 0; i < arrayData.length; i++) {
            const liveStream = arrayData[i];

            const elemCol = document.createElement("div");

            elemCol.className = "col";
            elemCol.setAttribute("id", liveStream.id);
            elemCol.title = "點擊以開啟影片的連結網址";
            elemCol.style.maxWidth = "320px";

            const elemCard = document.createElement("div");

            elemCard.className = "card";

            const elemThumbnail = document.createElement("img");

            elemThumbnail.className = "card-img-top";
            elemThumbnail.src = liveStream.thumbnailUrl;
            elemThumbnail.alt = "影片的預覽圖";

            elemCard.appendChild(elemThumbnail);

            const elemCardBody = document.createElement("div");

            elemCardBody.className = "card-body";

            const elemCardTitle = document.createElement("h5");

            elemCardTitle.className = "card-title text-end";

            const elemAvatar = document.createElement("img");

            elemAvatar.className = "rounded";
            elemAvatar.style.width = "30px";
            elemAvatar.style.border = "solid 1px #000000";
            elemAvatar.src = liveStream.imgUrl;
            elemAvatar.alt = `${liveStream.name}的頭像`;

            elemCardTitle.appendChild(elemAvatar);
            elemCardTitle.innerHTML += `&nbsp;${liveStream.name}`;
            elemCardTitle.title = `點擊以開啟${liveStream.name}在臺灣 VTuber 列表網站的頁面`;

            elemCardTitle.addEventListener("click", () => {
                window.open(`https://taiwanvtuberdata.github.io/vtuber/${liveStream.id}`, "_blank");
            });

            elemCardBody.appendChild(elemCardTitle);

            const elemStartTimeTitle = document.createElement("p");

            elemStartTimeTitle.className = "card-text";
            elemStartTimeTitle.innerHTML = `<i class=\"bi bi-alarm-fill\"></i>&nbsp;開始時間`;

            elemCardBody.appendChild(elemStartTimeTitle);

            const startDate = new Date(liveStream.startTime).toLocaleDateString();
            const startTime = new Date(liveStream.startTime).toLocaleTimeString();

            const elemStartTimeContent1 = document.createElement("p");

            elemStartTimeContent1.className = "card-text";

            const elemStartTimeContent2 = document.createElement("small");

            elemStartTimeContent2.className = "text-muted";
            elemStartTimeContent2.textContent = `${startDate} ${startTime}`;

            elemStartTimeContent1.appendChild(elemStartTimeContent2);

            elemCardBody.appendChild(elemStartTimeContent1);

            elemCard.appendChild(elemCardBody);

            elemCol.appendChild(elemCard);

            elemCol.addEventListener("click", () => {
                window.open(liveStream.videoUrl, "_blank");
            });

            targetElement.appendChild(elemCol);
        }
    } else {
        console.log("找不到目標的元素 dCardGroup。");
    }
}

/**
 * 取得 SHA 值
 *
 * @returns {any} SHA 值。
 */
async function getSha() {
    const masterJson = await getMasterJosn();

    if (masterJson !== null) {
        return masterJson.sha;
    } else {
        console.log("無法獲取 master.json。");
    }

    return null;
}

/**
 * 取得 livestreams 的值
 *
 * @param {string} sha 字串，SHA 值。
 * @returns {any[]} livestreams 的值。
 */
async function getLiveStreams(sha) {
    const debutNoTitleJson = await getDebutNoTitleJson(sha);

    if (debutNoTitleJson !== null) {
        return debutNoTitleJson.livestreams;
    } else {
        console.log("無法獲取 debut-no-title.json。");
    }

    return null;
}

/**
 * 獲取 master.json
 *
 * @returns {any} 獲取到的 JSON 內容。
 */
async function getMasterJosn() {
    return await fetch("https://api.github.com/repos/TaiwanVtuberData/TaiwanVTuberTrackingDataJson/commits/master")
        .then(response => {
            return response.json();
        }).catch(error => {
            console.log(error);

            return null;
        });
}

/**
 * 獲取 debut-no-title.json
 *
 * @param {string} sha 字串，SHA 值。
 * @returns {any} 獲取到的 JSON 內容。
 */
async function getDebutNoTitleJson(sha) {
    return await fetch(`https://cdn.statically.io/gh/TaiwanVtuberData/TaiwanVTuberTrackingDataJson/${sha}/api/v2/all/livestreams/debut-no-title.json`)
        .then(response => {
            return response.json();
        }).catch(error => {
            console.log(error);

            return null;
        });
}