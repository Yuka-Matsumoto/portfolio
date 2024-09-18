import { useLoaderData, redirect } from "@remix-run/react";
import { auth } from "../utils/firebase";

// Firebaseから取得するユーザー情報の型
interface User {
  uid: string;
  email: string;
  // その他必要なプロパティを追加
}

// 認証されたユーザーを確認するloader関数
export async function loader(): Promise<User> {
  return new Promise<User>((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user as User); // 型アサーションでUser型に変換
      } else {
        reject(redirect("/404"));
      }
    });
  });
}

export default function Admin() {
  const user = useLoaderData<User>();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>
      {/* 管理画面の機能を追加 */}
    </div>
  );
}