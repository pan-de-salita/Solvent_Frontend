import { redirect } from "react-router-dom";

export async function action({ params }) {
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

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.removeItem("Authorization");
        return redirect("/login");
      }
    }
  } catch (error) {
    console.log(error);
    return error as Error;
  }
}
