var passwordInputted = document.getElementById("userpass");
var lengthOfPass = document.getElementById("length");
var lowercaseLetter = document.getElementById("lowercase");
var uppercaseLetter = document.getElementById("uppercase");
var numberUsed = document.getElementById("number");
var credentialsToStore = [];
var passwordToStoreEncryptIV;
var passwordToStoreEncrypt;

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
    document.getElementById('table').style.display='inline';
    var table = document.getElementById('table');
    for (i=0; i <= localStorage.length; i++) {
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
    console.log("hi");
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
    } else {
        alert("Not a valid username for a password that is stored");
    }
}

async function editPassword() {
    var websiteName = document.getElementById("editwebpage").value;
    var usernameEdit = document.getElementById("editusername").value;
    var passwordEdit = document.getElementById("editpassword").value;
    var passwordStoredToEdit = localStorage.getItem(websiteName);
    var passwordStoredUnstring = JSON.parse(passwordStoredToEdit);
    if (usernameEdit == "" || passwordEdit == "") {
        alert("No Changes Have Been Made");
    } else {
        if (usernameEdit != "") {
            passwordStoredUnstring.userName = usernameEdit;
        } 
        if (passwordEdit != "") {
            let unencryptedPassword = await callDecryption(websiteName);
            let encryptedPassword = await callEncryption(passwordEdit,websiteName);
            passwordStoredUnstring.userName = encryptedPassword;
        }
    }
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
    console.log(passwordToStoreEncrypt);
}

async function callDecryption(website) {
    var website = website;
    var key = await keyDeriveFromPassword(website);
    var decrypted_pass = await decryptFromStore(key, website);
    return decrypted_pass;
}