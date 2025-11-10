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
  uploadBytes, 
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
const storage = getStorage(app); // ← Storage追加

// DOM要素取得
const loginBtn = document.getElementById("google-login");
const logoutBtn = document.getElementById("logout");
const loginArea = document.getElementById("login-area");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");

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

// ログイン状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginArea.style.display = "none";
    userInfo.style.display = "block";
    userName.textContent = `${user.displayName} さん`;
    userPhoto.src = user.photoURL;
  } else {
    loginArea.style.display = "block";
    userInfo.style.display = "none";
  }
});

// ==========================
// ▼ ここから追加：Storage連携
// ==========================

// ファイルアップロード関数
async function uploadFile(file) {
  if (!file) {
    alert("ファイルを選択してください。");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("ログインしてからアップロードしてください。");
    return;
  }

  try {
    const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);
    console.log("✅ アップロード完了:", url);
    alert("アップロード完了！URLをコンソールに表示しました。");
  } catch (error) {
    console.error("❌ アップロード失敗:", error);
    alert("アップロードに失敗しました。");
  }
}

// HTMLのボタン操作に紐付け
const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    uploadFile(file);
  });
}
