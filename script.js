var passwordInputted = document.getElementById("userpass");
var lengthOfPass = document.getElementById("length");
var lowercaseLetter = document.getElementById("lowercase");
var uppercaseLetter = document.getElementById("uppercase");
var numberUsed = document.getElementById("number");
var savedUsername = "admin";
var savedPassword = "password";
var credentialsToStore = [];

function createAccountWindow() {
    document.getElementById("createAccount").style.display = "inline";
}

function createAccount() {
    var usernameInputted = document.getElementById("login-username-new").value;
    var passwordInputted = document.getElementById("login-password-new").value;
    savedUsername = usernameInputted;
    savedPassword = passwordInputted;
    alert(savedUsername);
    document.getElementById("createAccount").style.display = "none";
}

function login() {
    var usernameInputted = document.getElementById("login-username").value;
    var passwordInputted = document.getElementById("login-password").value;
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

function showAllPasswords() {

}


function savePassword() {
    var websiteName = document.getElementById("webpage").value;
    var userName = document.getElementById("username").value;
    var passwordToStore = document.getElementById("password").value;

    credentialsToStore.push({websiteName, userName, password: passwordToStore})
    localStorage.setItem(websiteName, JSON.stringify(credentialsToStore))
    alert("Password Sucessfully Stored");


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
