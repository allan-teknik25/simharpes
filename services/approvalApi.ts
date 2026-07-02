const API_URL =
  "WEBAPP_URL_KAMU";

export async function submitApproval(
  data: any
) {

  const response =
    await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body: JSON.stringify({
        type: "approval",
        ...data
      })

    });

  return response.text();

}