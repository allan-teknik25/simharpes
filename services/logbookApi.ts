const API_URL =
  "https://script.google.com/macros/s/AKfycbw4G_VIfMw8NlYHm_iuo6GaEiXOkwGywtbH3yH38OhYTbVZ-1K5giAsC4iI_d6vV9j6/exec";

export async function submitLogbook(
  data: any
) {

  const response = await fetch(

    API_URL,

    {
      method: "POST",

      body: JSON.stringify(data),
    }

  );

  return response.json();

}