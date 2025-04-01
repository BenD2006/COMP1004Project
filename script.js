var passwordInputted = document.getElementById("userpass");
var lengthOfPass = document.getElementById("length");
var lowercaseLetter = document.getElementById("lowercase");
var uppercaseLetter = document.getElementById("uppercase");
var numberUsed = document.getElementById("number");
var credentialsToStore = [];
var passwordToStoreEncryptIV;
var passwordToStoreEncrypt;

function createAccountWindow() {
    if (localStorage.getItem("loginUser") != ''){
        document.getElementById("createAccount").style.display = "inline";
    } else {
        alert("User already created");
    }
}

async function createAccount() {
    document.getElementById("loginWindow").style.display = "none";
    let usernameInputted = document.getElementById("login-username-new").value;
    let passwordInputted = document.getElementById("login-password-new").value;
    if (passwordInputted.length < 8) {
        alert("Password Doesn't Meet Requirements");
        document.getElementById("loginWindow").style.display = "inline";
        return;
       
    }
    let q1ans = document.getElementById("sq1-answer").value;
    let q2ans = document.getElementById("sq2-answer").value;
    let loginCredentials = [];
    await callEncryption(passwordInputted, "loginUser");
    let pIv = passwordToStoreEncryptIV;
    let pEnc = passwordToStoreEncrypt;
    loginCredentials.push({websiteName:"loginUser", userName:usernameInputted, iv:pIv, encryptPass:pEnc, q1ans:q1ans, q2ans:q2ans});
    localStorage.setItem("loginUser", JSON.stringify(loginCredentials));
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("loginWindow").style.display = "inline";
}

function openWindow(partOfSite) {
    if (document.getElementById(partOfSite).style.display == "none") {
        document.getElementById(partOfSite).style.display = "block";
    } else if (document.getElementById(partOfSite).style.display == "block") {
        document.getElementById(partOfSite).style.display = "none";
    }
}
async function login() {
    var usernameInputted = document.getElementById("login-username").value;
    var passwordInputted = document.getElementById("login-password").value;
    var savedloginData = JSON.parse(localStorage.getItem("loginUser"))
    let savedPasswordEncrypt = await callDecryption("loginUser") 
    let savedUsername = savedloginData[0].userName;
    let usernameCorrect = false;
    let passwordCorrect = false;
    if (usernameInputted === savedUsername) {
        usernameCorrect = true;
    }
    if (passwordInputted === savedPasswordEncrypt) {
        passwordCorrect = true;
    }
    if (usernameCorrect == true && passwordCorrect == true) {
        document.getElementById("loginWindow").style.display = "none";
        document.getElementById("page").style.display = "inline";
        document.getElementById("menuRight").style.display = "inline";
    } else {
        alert("Either your username or password is incorrect, please try again");
    }
}

function logout() {
    document.getElementById('loginWindow').style.display='block';
    document.getElementById('menuRight').style.display = 'none';
}
function forgotPassword() {
    let resetFlag = false;
    let q1ansNew = document.getElementById("sq1-answer-fg").value;
    let q2ansNew = document.getElementById("sq2-answer-fg").value;
    let credentials = localStorage.getItem("loginUser");
    let unstringCredentials = JSON.parse(credentials);
    let q1ans = unstringCredentials[0].q1ans;
    let q2ans = unstringCredentials[0].q2ans;
    if (q1ansNew == q1ans && q2ansNew == q2ans) {
        resetFlag = true;
    }
    if (resetFlag == true) {
        document.getElementById("questions").style.display = "none";
        document.getElementById("passreset").style.display = "block";
    }

}
async function newPassword() {
    let passwordInputtedNew = document.getElementById("newPass").value;
    let credentials = localStorage.getItem("loginUser");
    let unstringCredentials = JSON.parse(credentials);
    await callEncryption(passwordInputtedNew,"loginUser");
    unstringCredentials[0].iv = passwordToStoreEncryptIV;
    unstringCredentials[0].encryptPass =  passwordToStoreEncrypt;
    localStorage.setItem("loginUser", JSON.stringify(unstringCredentials));
    document.getElementById("passreset").style.display = "none";
    document.getElementById("loginWindow").style.display = "none";
    document.getElementById("forgotpassword").style.display = "none";
    document.getElementById("page").style.display = "inline";
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
    if (passwordLength <8 || passwordLength >=100) {
        alert("Password Length is Invalid or Insecure"); 
    } else {
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
}

async function showSelectedPassword() {
    try{
        var websiteName = document.getElementById("webpageShow").value;
        var dataStored = localStorage.getItem(websiteName);
        if (!dataStored) {
            throw new Error("No Data");
        }
        var dataStoredList = JSON.parse(dataStored);
        var usernameStored;
        var passwordStored;
        usernameStored = dataStoredList[0].userName;
        passwordStored = await callDecryption(websiteName);
        document.getElementById("usernameOutput").innerHTML = usernameStored;
        document.getElementById("passwordOutput").innerHTML = passwordStored;
        document.getElementById("usernameOutput").style.display = "inline";
        document.getElementById("passwordOutput").style.display = "inline";
    } catch (error) {
        alert("No password found");
        console.error("ERROR OCCURED ", error);
    }
}

async function showAllPasswords() {
    if (document.getElementById('table').style.display='inline') {
        document.getElementById('table').innerHTML = '';
    }
    document.getElementById('table').style.display='inline';
    var table = document.getElementById('table');
    for (i=0; i <= localStorage.length - 1; i++) {
        var key = localStorage.key(i);
        var data = localStorage.getItem(key);
        var dataParsed = JSON.parse(data);
        var newRow = table.insertRow();
        var cella = newRow.insertCell();
        var cellb = newRow.insertCell();
        var cellc = newRow.insertCell();
        let password = await callDecryption(dataParsed[0].websiteName);
        cella.innerHTML = dataParsed[0].websiteName;
        cellb.innerHTML = dataParsed[0].userName;
        cellc.innerHTML = password
    }
}

async function savePassword() {
    var websiteName = document.getElementById("webpage").value;
    var userName = document.getElementById("username").value;
    var passwordToStore = document.getElementById("password").value;
    credentialsToStore = [];
    await callEncryption(passwordToStore, websiteName);
    credentialsToStore.push({websiteName:websiteName, userName:userName, iv:passwordToStoreEncryptIV, encryptPass: passwordToStoreEncrypt});
    localStorage.setItem(websiteName, JSON.stringify(credentialsToStore));
    alert("Password Sucessfully Stored");
    document.getElementById("savePasswordWindow").style.display = "none";
}

function deletePassword() {
    var websiteName = document.getElementById("deletewebpage").value;
    if (localStorage.getItem(websiteName) != null) {
        localStorage.removeItem(websiteName);
        alert("Password Deleted");
    } else {
        alert("Not a valid username for a password that is stored");
    }
}

async function editPassword() {
    let websiteName = document.getElementById("editwebpage").value;
    let usernameEdit = document.getElementById("editusername").value;
    let passwordEdit = document.getElementById("editpassword").value;
    let passwordStoredToEdit = localStorage.getItem(websiteName);
    let passwordStoredUnstring;

    if (!passwordStoredToEdit) {
        alert("No password stored for this website.");
    }
    try {
        passwordStoredUnstring = JSON.parse(passwordStoredToEdit);
    } catch (e) {
        alert("Error with password data.");
    }
    if (!Array.isArray(passwordStoredUnstring) || !passwordStoredUnstring[0] || typeof passwordStoredUnstring[0] !== 'object') {
        alert("Stored data is not in the expected format.");
    }

    if (usernameEdit === "" && passwordEdit === "") {
        alert("No Changes Have Been Made");
    }

    if (usernameEdit !== "") {
        passwordStoredUnstring[0].userName = usernameEdit;
    }

    if (passwordEdit !== "") {
        await callEncryption(passwordEdit, websiteName);
        passwordStoredUnstring[0].iv = passwordToStoreEncryptIV;
        passwordStoredUnstring[0].encryptPass = passwordToStoreEncrypt;
    }
    passwordStoredToEdit = JSON.stringify(passwordStoredUnstring);
    localStorage.setItem(websiteName, passwordStoredToEdit);
    alert("Sucessfully Edited");
    document.getElementById('editPasswordWindow').style.display='none'
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

function changeBGColour(colour) {
    document.body.style.background = colour;
}

function themeToggle() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('showModalDarkMode');
}

async function keyDeriveFromPassword(password) {
    const buffer = new TextEncoder().encode(password);
    const salt = new TextEncoder().encode("mysalt");
    const keyDerive = await crypto.subtle.importKey(
        "raw",
        buffer,
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations:10000,
            hash: "SHA-256"
        },
        keyDerive,
        {
            name: "AES-GCM",
            length:256
        },
        true,
        ["encrypt", "decrypt"]
    );

    return key;
}

async function encryptAndStore(encryption_key, data_to_encrypt, websiteName) {
    var data_encoded = new TextEncoder()
    var data = data_encoded.encode(data_to_encrypt);
    var iv = window.crypto.getRandomValues(new Uint8Array(12));
    var data_encrypted = await crypto.subtle.encrypt(
        {
            name:"AES-GCM",
            iv:iv,
        },
        encryption_key,
        data
    );
    passwordToStoreEncryptIV = Array.from(iv);
    passwordToStoreEncrypt = Array.from(new Uint8Array(data_encrypted))
}

async function decryptFromStore(key, website) {
    try {
        var encrypted_data_string = localStorage.getItem(website);
        if (!encrypted_data_string) {
            throw new Error ("NO DATA");
        }
        var encrypted_data = JSON.parse(encrypted_data_string);
        var ivDecrypt = new Uint8Array(encrypted_data[0].iv);
        var encrypted_array = new Uint8Array(encrypted_data[0].encryptPass);
        var decrypted_data = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: ivDecrypt,
            },
            key,
            encrypted_array
        );

        const decoder = new TextDecoder();
        let decodedData =  decoder.decode(decrypted_data);
        return decodedData;
    } catch (error) {
        console.error("ERROR OCCURED ", error);
    }
}

async function callEncryption(data, website) {
    var data = data;
    var website = website;
    var key = await keyDeriveFromPassword(website);
    await encryptAndStore(key, data, website);
}

async function callDecryption(website) {
    var website = website;
    var key = await keyDeriveFromPassword(website);
    var decrypted_pass = await decryptFromStore(key, website);
    return decrypted_pass;
}
