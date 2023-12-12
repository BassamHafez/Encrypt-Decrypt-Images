const myImg = document.getElementById("myImg");
const resultImage = document.getElementById("resultImage");
const errorMessage = document.getElementById("errorMessage");
const myMsg = document.getElementById("myMsg");
const downloadLink = document.getElementById("downloadLink");
const inputmode = document.getElementById("mode");
const inputKey = document.getElementById("key");
const encBtn= document.getElementById("encBtn");
const decBtn= document.getElementById("decBtn");
let succMsg= document.getElementById("succMsg");
const imgContainer=document.getElementById("imgContainer");
const controlers=document.getElementById("controlers");

const clearMessages=()=>{
  myMsg.style.display = "none";
  myMsg.innerHTML = "";
  succMsg.innerHTML="";
  succMsg.display="none"
  resultImage.style.display = "none";
}
const hideresult=()=>{
    downloadLink.style.display="none";
    imgContainer.style.cssText="opacity:0;"
}
const showresult=()=>{
    downloadLink.style.display="block";
    imgContainer.style.cssText="opacity:1;";
}

const encryptionHandler=()=> {
  hideresult();
  clearMessages();
  key= inputKey.value;
  mode=inputmode.value
  if (key.length > 16) {
    myMsg.innerHTML = "Your Key should be less than 16";
    myMsg.style.display="block";
    showresult();
    downloadLink.style.display="none";
    return;
  }
  const file = myImg.files[0];
  if (!file) {
    myMsg.innerHTML = "There is No Image to Encrypt!";
    myMsg.style.display = "block";
    showresult();
    downloadLink.style.display="none";
    return;
  }


  const reader = new FileReader();
  reader.readAsDataURL(file)
  reader.onload = function (event) {
    const imageData = event.target.result;
    let encrypted;
    switch (mode) {
      case "ECB":
        encrypted = CryptoJS.AES.encrypt(imageData, key, { mode: CryptoJS.mode.ECB });
        break;
      case "CBC":
        encrypted = CryptoJS.AES.encrypt(imageData, key, { mode: CryptoJS.mode.CBC });
        break;
      case "CTR":
        encrypted = CryptoJS.AES.encrypt(imageData, key, { mode: CryptoJS.mode.CTR });
        break;
      default:
        break;
    }
    const result = encrypted.toString();
    const myBlob = new Blob([result], { type: "image/png" });
    const url = URL.createObjectURL(myBlob);
    downloadLink.href = url;
    downloadLink.setAttribute("download", "encImg.png");
    succMsg.innerHTML="Image Encrypted Successfully <i class='fa-solid fa-user-secret'></i>"
    succMsg.style.display="block"
    showresult();


    // resultImage.src = result;
    // resultImage.style.display = "block";

  };

}

const decryptImage=()=> {

  hideresult();
  clearMessages();

  key= inputKey.value;
  mode=inputmode.value;
  
  const file = myImg.files[0];

  if (!file) {
    myMsg.textContent = "There is No Image to Decrypt!";
    myMsg.style.display = "block";
    showresult();
    downloadLink.style.display="none";
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    const encryptedData = event.target.result;
    let decrypted;
    switch (mode) {
      case "ECB":
        decrypted = CryptoJS.AES.decrypt(encryptedData, key, { mode: CryptoJS.mode.ECB });
        break;
      case "CBC":
        decrypted = CryptoJS.AES.decrypt(encryptedData, key, { mode: CryptoJS.mode.CBC });
        break;
      case "CTR":
        decrypted = CryptoJS.AES.decrypt(encryptedData, key, { mode: CryptoJS.mode.CTR });
        break;
      default:
        break;
    }
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    const isImageData = /^data:image\/\w+;base64,/;
    isImageData.test(decryptedData);
    if (!isImageData) {
      myMsg.innerHTML = "Oh! sorry Your Image Is Invalid.";
      myMsg.style.display = "block";
      showresult();
      downloadLink.style.display="none";
      return;
    }
    resultImage.src = decryptedData;
    resultImage.style.display = "block";
    downloadLink.href = resultImage.src;
    downloadLink.setAttribute("download", "decImg.png");
    succMsg.style.display="none"
    showresult();
  };

}

encBtn.addEventListener('click',encryptionHandler);
decBtn.addEventListener('click',decryptImage);

