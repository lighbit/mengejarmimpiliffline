/*Apabila Anda menggunakan node.js Anda dapat mengubah nilai dari useNodeJS menjadi true 
tanpa mengisi defaultLiffID. Namun apabila tidak menggunakan node.js dan deploy aplikasi 
ke service seperti Heroku maka Anda dapat mengisinya dengan false dan wajib mengisi defaultLiffID. 
Anda dapat mengisi defaultLIffId dengan LIFF ID yang terletak pada LIFF URL di channel LIFF LINE Developers 
yang sudah Anda buat. */

window.onload = function() {
  const useNodeJS = false; // if you are not using a node server, set this value to false
  const defaultLiffId = "1653656167-KJMVkdMl"; // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch("/send-id")
      .then(function(reqResponse) {
        return reqResponse.json();
      })
      .then(function(jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function(error) {
        document.getElementById("liffAppContent").classList.add("hidden");
        document
          .getElementById("nodeLiffIdErrorMessage")
          .classList.remove("hidden");
      });
  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    document.getElementById("liffAppContent").classList.add("hidden");
    document.getElementById("liffIdErrorMessage").classList.remove("hidden");
  } else {
    initializeLiff(myLiffId);
  }
}

/**Kode di atas digunakan untuk mengecek
 * kondisi apakah myLiffId bernilai null, apabila null maka LIFF tidak akan di inisialisasi. */

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
  liff
    .init({
      liffId: myLiffId
    })
    .then(() => {
      // start to use LIFF's api
      initializeApp();
    })
    .catch(err => {
      document.getElementById("liffAppContent").classList.add("hidden");
      document
        .getElementById("liffInitErrorMessage")
        .classList.remove("hidden");
    });
}
/**Pada script di atas, LIFF ID yang berhasil di inisialisasi dan sesuai dengan yang ada pada
 * LINE Developers maka Anda bisa menggunakan LIFF API.
 * Apabila tidak maka ia akan menampilkan pesan eror bahwa inisialisasi LIFF gagal. */

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  displayLiffData();
  displayIsInClientInfo();
  registerButtonHandlers();

  /**Function initializeApp di atas menjelaskan bahwa isLoggedIn akan menampilkan informasi
   * pengguna serta mengecek apakah pengguna membuka aplikasi LIFF pada LINE atau eksternal browser.
   * Apabila pengguna membuka aplikasi LIFF pada LINE maka tombol Login dan Logout tidak akan ditampilkan.
   * Namun apabila melalui eksternal browser, maka tombol login dan logout akan ditampilkan. */

  // check if the user is logged in/out, and disable inappropriate button
  if (liff.isLoggedIn()) {
    document.getElementById("liffLoginButton").disabled = true;
  } else {
    document.getElementById("liffLogoutButton").disabled = true;
  }
}

/**
 * Display data generated by invoking LIFF methods
 */
function displayLiffData() {
  document.getElementById("browserLanguage").textContent = liff.getLanguage();
  document.getElementById("sdkVersion").textContent = liff.getVersion();
  document.getElementById("isInClient").textContent = liff.isInClient();
  document.getElementById("isLoggedIn").textContent = liff.isLoggedIn();
  document.getElementById("deviceOS").textContent = liff.getOS();
}

/**Pada function displayLiffData berguna untuk menampilkan informasi yang diperoleh dari fungsi 
 * liff.isInClient dan isLoggedIn.
 
/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
  if (liff.isInClient()) {
    document.getElementById("liffLoginButton").classList.toggle("hidden");
    document.getElementById("liffLogoutButton").classList.toggle("hidden");
    document.getElementById("isInClientMessage").textContent =
      "You are opening the app in the in-app browser of LINE.";
  } else {
    document.getElementById("isInClientMessage").textContent =
      "You are opening the app in an external browser.";
  }
}
/**Function displayIsInClientInfo berperan untuk mengecek apabila pengguna menjalankan
 * aplikasi LIFF dari LINE maka pesan “You are opening the app in the in-app browser of LINE” akan tampil.
 * Namun apabila kita menjalankannya di eksternal browser,
 * maka yang tampil adalah“You are opening the app in an external browser.” */

function registerButtonHandlers() {
  // openWindow call
  document
    .getElementById("openWindowButton")
    .addEventListener("click", function() {
      liff.openWindow({
        url: "https://mengejarmimpi.herokuapp.com/",
        external: true
      });
    });

  /**Kode diatas menjelaskan apabila kita klik tombol open window, maka method liff.openWindow() akan dijalankan.
   * Isi parameter url dengan Endpoint URL aplikasi web yang sudah Anda deploy di Heroku atau lainnya.
   * Sedangkan jika parameter external diisi dengan nilai true maka URL di jalankan pada external browser.
   * Namun, jika diisi dengan nilai false maka URL akan dibuka pada browser LINE. */

  // closeWindow call
  document
    .getElementById("closeWindowButton")
    .addEventListener("click", function() {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        liff.closeWindow();
      }
    });

  /**Pada saat pengguna klik tombol close, script akan mengecek kondisi apakah pengguna
   * membuka aplikasi LIFF pada LINE atau eksternal browser. Apabila dijalankan di LINE maka aplikasi akan tertutup.
   * Namun, apabila tidak dijalankan di LINE maka Alert Notification akan tampil.
   */

  // login call, only when external browser is used
  document
    .getElementById("liffLoginButton")
    .addEventListener("click", function() {
      if (!liff.isLoggedIn()) {
        // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
        liff.login();
      }
    });

  // logout call only when external browse
  document
    .getElementById("liffLogoutButton")
    .addEventListener("click", function() {
      if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
      }
    });
  /**Baik login dan logout pada kode di atas digunakan apabila kita membuka aplikasi LIFF pada eksternal browser.
 *  Apabila kita membuka aplikasi LIFF pada LINE maka fitur tersebut tidak akan dijalankan. 
 * Dalam kode diatas dijelaskan bahwa apabila klik tombol login maka secara otomatis akan mengecek 
 * apakah pengguna sudah masuk menggunakan akun LINE atau belum. Apabila belum login maka pengguna diharuskan 
 * login terlebih dahulu yang kemudian akan di redirect menuju aplikasi lagi apabila login sukses. 
 * Sedangkan untuk dapat menggunakan logout, akan dicek kembali apakah pengguna sudah dalam posisi
 *  masuk dengan akun LINE (atau belum). Kalau sudah login sebelumnya, maka pengguna dapat logout akun LINE.

 */

  // sendMessages call
  document
    .getElementById("sendMessageButton")
    .addEventListener("click", function() {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        liff
          .sendMessages([
            {
              type: "text",
              text: "You've successfully sent a message! Hooray!"
            }
          ])
          .then(function() {
            window.alert("Message sent");
          })
          .catch(function(error) {
            window.alert("Error sending message: " + error);
          });
      }
    });
  /**Sebelum sendMessages dijalankan, sistem akan mengecek apakah aplikasi catatan sederhana dijalankan
   * di eksternal browser atau tidak. Apabila dijalankan pada browser maka fitur sendMessages tidak dapat digunakan.
   * Namun, apabila dijalankan di LINE berdasarkan kode di atas, sendMessages yang dijalankan akan mengirim pesan
   * bertipe text dengan isi “Anda telah menggunakan fitur Send Message!”. Sehingga menampilkan notifikasi alert
   * yang menunjukkan bahwa pengguna telah berhasil menggunakan fitur sendMessages. */

  // scanCode call
  document
    .getElementById("scanQrCodeButton")
    .addEventListener("click", function() {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        liff
          .scanCode()
          .then(result => {
            // e.g. result = { value: "Hello LIFF app!" }
            const stringifiedResult = JSON.stringify(result);
            document.getElementById(
              "scanQrField"
            ).textContent = stringifiedResult;
            toggleQrCodeReader();
          })
          .catch(err => {
            document.getElementById("scanQrField").textContent =
              "scanCode failed!";
          });
      }
    });

  // get access token
  document
    .getElementById("getAccessToken")
    .addEventListener("click", function() {
      if (!liff.isLoggedIn() && !liff.isInClient()) {
        alert(
          'To get an access token, you need to be logged in. Please tap the "login" button below and try again.'
        );
      } else {
        const accessToken = liff.getAccessToken();
        document.getElementById("accessTokenField").textContent = accessToken;
        toggleAccessToken();
      }
    });

  // get profile call
  document
    .getElementById("getProfileButton")
    .addEventListener("click", function() {
      liff
        .getProfile()
        .then(function(profile) {
          document.getElementById("userIdProfileField").textContent =
            profile.userId;
          document.getElementById("displayNameField").textContent =
            profile.displayName;

          const profilePictureDiv = document.getElementById(
            "profilePictureDiv"
          );
          if (profilePictureDiv.firstElementChild) {
            profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
          }
          const img = document.createElement("img");
          img.src = profile.pictureUrl;
          img.alt = "Profile Picture";
          profilePictureDiv.appendChild(img);

          document.getElementById("statusMessageField").textContent =
            profile.statusMessage;
          toggleProfileData();
        })
        .catch(function(error) {
          window.alert("Error getting profile: " + error);
        });
    });
}

function sendAlertIfNotInClient() {
  alert(
    "This button is unavailable as LIFF is currently being opened in an external browser."
  );
}

/**
 * Toggle access token data field
 */
function toggleAccessToken() {
  toggleElement("accessTokenData");
}

/**
 * Toggle profile info field
 */
function toggleProfileData() {
  toggleElement("profileInfo");
}

/**
 * Toggle scanCode result field
 */
function toggleQrCodeReader() {
  toggleElement("scanQr");
}

function sendAlertIfNotInClient() {
  alert(
    "This button is unavailable as LIFF is currently being opened in an external browser."
  );
}

/**
 * Toggle specified element
 * @param {string} elementId The ID of the selected element
 */
function toggleElement(elementId) {
  const elem = document.getElementById(elementId);
  if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
    elem.style.display = "none";
  } else {
    elem.style.display = "block";
  }
}
/**Function sendAlertIfNotInClient berguna untuk menampilkan pesan di layar yang menandakan aplikasi
 * LIFF tidak mendukung eksternal browser. Sedangkan function toggleElement digunakan untuk beralih dari
 * satu elemen ke elemen yang lainnya. */
