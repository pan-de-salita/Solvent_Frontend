import { redirect } from "react-router-dom";

export async function action() {
  try {
    const authToken = localStorage.getItem("Authorization");
    if (authToken) {
      const response = await fetch(
        "https://solvent-nfkw.onrender.com/api/v1/logout",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(authToken),
          },
        },
      );

      localStorage.removeItem("Authorization");

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        return redirect("/");
      }
    }
  } catch (error) {
    console.log(error);
    return redirect("/");
  }
}
