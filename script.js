var passwordInputted = document.getElementById("userpass");
var lengthOfPass = document.getElementById("length");
var lowercaseLetter = document.getElementById("lowercase");
var uppercaseLetter = document.getElementById("uppercase");
var numberUsed = document.getElementById("number");
var credentialsToStore = [];

function createAccountWindow() {
    document.getElementById("createAccount").style.display = "inline";
}

function createAccount() {
    var usernameInputted = document.getElementById("login-username-new").value;
    var passwordInputted = document.getElementById("login-password-new").value;
    var loginCredentials = [];
    loginCredentials.push({websiteName:"pms", userName:usernameInputted, password:passwordInputted});
    localStorage.setItem("loginUser", JSON.stringify(loginCredentials));
    document.getElementById("createAccount").style.display = "none";
}

function openShowPassword() {
    if (document.getElementById('showpassword').style.display = "none") {
        document.getElementById('showpassword').style.display = "block";
    } else if (document.getElementById('showpassword').style.display = "block") {
        document.getElementById('showpassword').style.display = "none";
    }
}

function login() {
    var usernameInputted = document.getElementById("login-username").value;
    var passwordInputted = document.getElementById("login-password").value;
    var savedloginData = JSON.parse(localStorage.getItem("loginUser"))
    for (var i = 0; i < savedloginData.length; i++) {
            var savedUsername = savedloginData[i].userName;
            var savedPassword = savedloginData[i].password;
            break;
    }
    var usernameCorrect = false;
    var passwordCorrect = false;
    if (usernameInputted === savedUsername) {
        usernameCorrect = true;
    }
    if (passwordInputted === savedPassword) {
        passwordCorrect = true;
    }
    if (usernameCorrect == true && passwordCorrect == true) {
        document.getElementById("loginWindow").style.display = "none";
        document.getElementById("page").style.display = "inline";
    } else {
        alert("Either your username or password is incorrect, please try again");
    }
}

function generatePassword() {
    const baseChars = "abcdefghijklmnopqrstuvwxyz";
    var charsToUse = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numericCharacters = "0123456789";
    const symbolCharacters = "!£$%^&*()[]{}'@#~;:/?";
    var passwordLength = document.getElementById("numofchar").value;
    var specialChar = document.getElementById("sym").checked;
    var upChar = document.getElementById("uchar").checked;
    var numbers = document.getElementById("num").checked;
    var generatedPassword = "";
    if (specialChar == true) {
        charsToUse += symbolCharacters;
    }
    if (upChar == true) {
        charsToUse += uppercaseCharacters;
    }
    if (numbers == true) {
        charsToUse += numericCharacters;
    }
    for (i=0;i < passwordLength; i++) {
        charToAdd = charsToUse[Math.floor(Math.random() * charsToUse.length)];
        generatedPassword += charToAdd;
    }
    document.getElementById("passwordGenOutput").innerHTML = generatedPassword;
    document.getElementById("passwordgen").style.display = "inline";
    document.getElementById("passwordGenOutput").style.display = "inline";
    charsToUse = "abcdefghijklmnopqrstuvwxyz";
}

function showSelectedPassword() {
    var websiteName = document.getElementById("webpageShow").value;
    var dataStored = localStorage.getItem(websiteName);
    var dataStoredList = JSON.parse(dataStored);
    var usernameStored;
    var passwordStored;
    for (var i = 0; i < dataStoredList.length; i++) {
        if (dataStoredList[i].websiteName === websiteName) {
            usernameStored = dataStoredList[i].userName;
            passwordStored = dataStoredList[i].password;
            break;
        }
    }
    if (usernameStored == undefined) {
        //alert(usernameStored);
    } else {
        alert("Website not found.");
    }
    if (passwordStored !== undefined) {
        //alert(passwordStored);
    } else {
        alert("Website not found.");
    }
    document.getElementById("usernameOutput").innerHTML = usernameStored;
    document.getElementById("passwordOutput").innerHTML = passwordStored;
    document.getElementById("usernameOutput").style.display = "inline";
    document.getElementById("passwordOutput").style.display = "inline";

}

function showAllPasswords() {
    document.getElementById('table').style.display='inline';
    var table = document.getElementById('table');
    console.log(localStorage.length);
    for (i=0; i <= localStorage.length; i++) {
        console.log(i);
        var key = localStorage.key(i);
        console.log(key);
        var data = localStorage.getItem(key);
        console.log(data);
        var dataParsed = JSON.parse(data);
        console.log(dataParsed);
        var newRow = table.insertRow();
        var cella = newRow.insertCell();
        var cellb = newRow.insertCell();
        var cellc = newRow.insertCell();
        cella.innerHTML = dataParsed[0].websiteName;
        cellb.innerHTML = dataParsed[0].userName;
        cellc.innerHTML = dataParsed[0].password
    }
}
function savePassword() {
    var websiteName = document.getElementById("webpage").value;
    var userName = document.getElementById("username").value;
    var passwordToStore = document.getElementById("password").value;
    var encryptedpass = callEncryption(passwordToStore);
    console.log(encryptedpass);
    credentialsToStore = [];
    credentialsToStore.push({websiteName:websiteName, userName:userName, password: passwordToStore});
    localStorage.setItem(websiteName, JSON.stringify(credentialsToStore));
    alert("Password Sucessfully Stored");
    document.getElementById("savePasswordWindow").style.display = "none";


}


function clearStorage() {
    localStorage.clear();
}
passwordInputted.onkeyup = function validatePassword() {
    var length = passwordInputted.value.length;
    var lengthVal = false;
    var capsVal = false;
    var lowerVal = false;
    var numVal = false;
    var symbolVal = false;
    if (length >=8) {
        lengthOfPass.classList.remove("invalid");
        lengthOfPass.classList.add("valid");
        lengthVal = true;
        
    } else {
        lengthOfPass.classList.remove("valid");
        lengthOfPass.classList.add("invalid");
    }
    var lowercaseLetters = /[a-z]/g;
    if (passwordInputted.value.match(lowercaseLetters)) {  
      lowercase.classList.remove("invalid");
      lowercase.classList.add("valid");
      lowerVal = true;
    } else {
      lowercase.classList.remove("valid");
      lowercase.classList.add("invalid");
    }
    var uppercaseLetters = /[A-Z]/g;
    if (passwordInputted.value.match(uppercaseLetters)) {
        uppercase.classList.remove("invalid");
        uppercase.classList.add("valid");
        capsVal = true;
    } else {
        uppercase.classList.remove("valid");
        uppercaseLetter.classList.add("invalid");
    }
    var numbers = /[0-9]/g;
    if (passwordInputted.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
        numVal = true;
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }
    var symbols = /[*[@$! %*?&£&]/g;
    if (passwordInputted.value.match(symbols)) {
        special.classList.remove("invalid");
        special.classList.add("valid");
        symbolVal = true;
    } else {
        special.classList.remove("valid");
        special.classList.add("invalid");
    }
    if (numVal == true && capsVal == true && lowerVal == true && lengthVal == true && symbolVal == true) {
        document.getElementById('passwordmeetsmessage').style.display='inline'
    } else {
        document.getElementById('passwordmeetsmessage').style.display='none'
    }
}

async function keyGenerationForEncryption() {
    var key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt","decrypt"]
    );
    return key;
}

async function encrypt(encryption_key, data_to_encrypt) {
    var data_encoded = new TextEncoder().encode(data_to_encrypt);
    var iv = window.crypto.getRandomValues(new Uint8Array(12));

    var data_encrypted = await crypto.subtle.encrypt(
        {
            name:"AES-GCM",
            iv:iv,
        },
        encryption_key,
        data_encoded
    );

    return {
        iv:iv,
        encryptedData: data_encrypted
    };
}

async function decrypt(encryption_key, encrypted_data, iv) {
    var decrypted_data = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        encryption_key,
        encrypted_data
    );

    return new TextDecoder().decode(decrypted_data);
}

async function callEncryption(data) {
    var key = await keyGenerationForEncryption();
    var data = data;

    var {iv, encryptedData} = await encrypt(key, data);
    console.log(encryptedData);
    var encD = []
    var uint8Array = new Uint8Array(encryptedData);
    encD = Array.from(uint8Array);
    console.log(encD);

    
}

