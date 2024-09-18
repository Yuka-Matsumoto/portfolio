import { useLoaderData } from "@remix-run/react";
import { getProfileData, ProfileData } from "../utils/data";
import "../styles/tailwind.css";


// loader 関数でプロフィールデータを取得し、それを返す
export const loader = async () => {
  const data = await getProfileData();
  
  // データが取得できなかった場合にエラーをスロー
  if (!data) {
    throw new Response("データが見つかりません", { status: 404 });
  }
  
  return data;
};

export default function Index() {
  // useLoaderDataでProfileDataの型を指定してデータを取得
  const { profile, skills, works } = useLoaderData<ProfileData>();



  return (
    <div>
      {/* プロフィール情報の表示 */}
      <section>
        <h1>{profile.name}</h1>
        <img src={profile.image} alt={`プロフィール写真: ${profile.name}`} />
        <p>{profile.bio}</p>
      </section>

      {/* スキル情報の表示 */}
      <section>
        <h2>Skills</h2>
        <ul>
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* 実績情報の表示 */}
      <section>
        <h2>Works</h2>
        <ul>
          {works.map((work) => (
            <li key={work.title}>{work.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
