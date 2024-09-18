import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";  // useEffect を追加
import { auth } from "../utils/firebase";  // Firebase Auth のインポート
import { useNavigate } from "@remix-run/react";  // Remix のナビゲーション

export default function UploadImage() {
  const [image, setImage] = useState<File | null>(null);  // imageの型を明確に指定
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Firebase Authでログインしていない場合、404にリダイレクト
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/404");  // 引数を1つだけに修正
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUpload = () => {
    if (!image) {
      setError("画像が選択されていません");
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercentage);  // プログレスバー用に進捗を設定
      },
      (error) => {
        console.error("アップロード失敗", error);
        setError("アップロードに失敗しました");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          setError("");  // エラーをリセット
        });
      }
    );
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files?.[0] || null);
          setError("");  // 新しい画像選択時にエラーをリセット
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      
      {progress > 0 && <p>アップロード進捗: {progress.toFixed(2)}%</p>}  {/* アップロード進捗の表示 */}
      
      {error && <p style={{ color: "red" }}>{error}</p>}  {/* エラー表示 */}
      
      {url && <img src={url} alt="Uploaded" />}  {/* アップロードされた画像を表示 */}
    </div>
  );
}
