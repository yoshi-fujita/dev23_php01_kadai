// 保存を行うプログラムがあるURL
const SAVE_URL = 'http://localhost/household/write.php';

// 画像が保存されているURL
const IMAGE_URL = 'http://localhost/household/data';

// video capture
let snap;

const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
}).then(stream => {
    video.srcObject = stream;
    video.play()
}).catch(e => {
  console.log(e)
}) // 動画の入力と表示

function snapshot(){
    let videoElement = document.querySelector('video');
    let canvasElement = document.querySelector('canvas');
    let context = canvasElement.getContext('2d');

    context.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    return canvasElement.toDataURL();
} // 最新画像をキャプチャ

$("#capture").on("click", function () {
    snap = snapshot();
    $("#canvas").show();
}); // キャプチャして表示

document.querySelector("#submit").addEventListener("click", ()=>{
    const param  = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({data: snap})
    };
    sendServer(SAVE_URL, param);
  });

// サーバへ送信
 function sendServer(url, param){
   fetch(url, param)
     .then((response)=>{
       return response.json();
     })
     .then((json)=>{
       if(json.status){
         setImage(json.result);    //json.resultにはファイル名が入っている
       }
       else{
         alert("送信に『失敗』しました");
         console.log(`[error1] ${json.result}`);
       }
     })
     .catch((error)=>{
       alert("送信に『失敗』しました");
       console.log(`[error2] ${error}`);
     });
 }

// サーバ上の画像を表示
function setImage(path){
  const url = `${IMAGE_URL}/${path}`;
  const result = document.querySelector("#result");
  const li = document.createElement("li");
  li.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer"><img src="${url}" class="saveimage"></a>`;
  result.insertBefore(li, result.firstChild);
}


// $("#submit").on("click", function () {
//     console.log("snap:", snap);
//     let postdata = { snap };
//     let jsontext = JSON.stringify(postdata);
//     console.log("JSON:", jsontext);

//     $.ajax({
//         url: "http://localhost/household/write.php", // 送信先
//         type: 'POST',
//         dataType: 'json',
//         data: jsontext,
//         processData: false,
//         contentType: false
//     })
//     .done(function( data, textStatus, jqXHR ) {
//         // 送信成功
//     })
//     .fail(function( jqXHR, textStatus, errorThrown ) {
//         // 送信失敗
//     });  
// });


    // xhr = new XMLHttpRequest;       //インスタンス作成
    // xhr.onload = function(){        //レスポンスを受け取った時の処理（非同期）
    //     let res = xhr.responseText;
    //     if (res.length>0) alert(res);
    // };
    // xhr.onerror = function(){       //エラーが起きた時の処理（非同期）
    //     alert("error!");
    // }
    // xhr.open('post', "http://localhost/household/write.php", true);    //(1)
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(jsontext);    //送信実行

    // $("#canvas").fadeOut(1000);

