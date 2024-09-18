import { Form, useActionData } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";

// Actionの返り値の型定義
type ActionData = {
  success: boolean;
};

// Action 関数に型注釈を付ける
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  // メール送信ロジックなど
  console.log(`Name: ${name}, Message: ${message}`);

  return { success: true };
};

export default function Contact() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Contact Us</h1>
      <Form method="post">
        <label>
          Name: <input type="text" name="name" />
        </label>
        <label>
          Message: <textarea name="message" />
        </label>
        <button type="submit">Send</button>
      </Form>
      {actionData?.success && <p>Message sent!</p>}
    </div>
  );
}
