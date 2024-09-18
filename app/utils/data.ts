import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "./firebase.js";

// Firestoreの初期化
const db = getFirestore(firebaseApp);

// 型定義
export type ProfileData = {
  profile: {
    name: string;
    image: string;
    bio: string;
  };
  skills: string[];
  works: { title: string }[];
};

// プロフィールデータを取得する関数
export async function getProfileData(): Promise<ProfileData | null> {
  try {
    // Firestoreからデータを取得
    const profileDoc = await getDoc(doc(db, "profile", "userId"));
    const skillsDoc = await getDoc(doc(db, "skills", "userId"));
    const worksDoc = await getDoc(doc(db, "works", "userId"));

    // データが存在しない場合にエラーハンドリング
    if (!profileDoc.exists() || !skillsDoc.exists() || !worksDoc.exists()) {
      throw new Error("データが見つかりません");
    }

    // Firestoreから取得したデータを返す
    return {
      profile: profileDoc.data() as {
        name: string;
        image: string;
        bio: string;
      },
      skills: skillsDoc.data()?.skillsArray ?? [],
      works: worksDoc.data()?.worksArray ?? [],
    };
  } catch (error) {
    console.error("データの取得中にエラーが発生しました: ", error);
    return null;
  }
}
