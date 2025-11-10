// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ✅ あなたのFirebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBdEDkaXuJLiUvl29Ld9AL_Kq7OPZEcReQ",
  authDomain: "ai-manual-lab.firebaseapp.com",
  projectId: "ai-manual-lab",
  storageBucket: "ai-manual-lab.firebasestorage.app",
  messagingSenderId: "14066800475",
  appId: "1:14066800475:web:d54d16d83958a2c262ec7e",
  measurementId: "G-8P6PXFTCN0"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// DOM要素取得
const loginBtn = document.getElementById("google-login");
const logoutBtn = document.getElementById("logout");
const loginArea = document.getElementById("login-area");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");
const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");
const uploadStatus = document.getElementById("upload-status");

// ログイン処理
loginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ ログイン成功:", user);
    alert(`ようこそ ${user.displayName} さん！`);
  } catch (error) {
    console.error("❌ ログイン失敗:", error);
    alert("ログインに失敗しました。コンソールを確認してください。");
  }
});

// ログアウト処理
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  console.log("👋 ログアウトしました");
});

// アップロード処理
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("アップロードするファイルを選択してください。");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("ログインしてください。");
    return;
  }

  const fileRef = ref(storage, `users/${user.uid}/${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  uploadStatus.textContent = "アップロード中...";

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploadStatus.textContent = `アップロード中... ${progress.toFixed(0)}%`;
    },
    (error) => {
      console.error("❌ アップロード失敗:", error);
      uploadStatus.textContent = "アップロード失敗";
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("✅ アップロード成功:", downloadURL);
      uploadStatus.innerHTML = `✅ アップロード完了！<br><a href="${downloadURL}" target="_blank">ファイルを開く</a>`;
    }
  );
});

// ログイン状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginArea.style.display = "none";
    userInfo.style.display = "block";
    uploadForm.style.display = "block";
    userName.textContent = `${user.displayName} さん`;
    userPhoto.src = user.photoURL;
  } else {
    loginArea.style.display = "block";
    userInfo.style.display = "none";
    uploadForm.style.display = "none";
  }
});
