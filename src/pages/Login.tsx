import { Form, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVial } from "@fortawesome/free-solid-svg-icons";

async function login(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(
      "https://solvent-nfkw.onrender.com/api/v1/login",
      {
        method: "POST",
        body: JSON.stringify({ user: credentials }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const authToken = response.headers.get("Authorization");
    if (authToken) {
      localStorage.setItem("Authorization", JSON.stringify(authToken));
    }

    const data = response.json();
    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData) as {
    email: string;
    password: string;
  };
  const response = await login(credentials);
  return response;
}

export default function Login() {
  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center bg-gray-500">
        <Form
          method="post"
          className="mt-20 flex min-w-[20rem] max-w-[50rem] flex-col items-center justify-center gap-4 rounded-lg bg-gray-400 px-6 py-8"
        >
          <div className="mb-2 flex items-center justify-center gap-2 text-gray-100">
            <span className="logo text-4xl">solvent</span>
            <FontAwesomeIcon
              icon={faVial}
              className="rounded border-2 border-gray-100 p-1 text-lg"
            />
          </div>
          <div className="flex w-full flex-col gap-4">
            <input
              placeholder="email"
              type="text"
              name="email"
              className="rounded-lg border-[1px] border-gray-200 bg-gray-300 p-2 text-sm text-gray-100 placeholder-gray-200"
            />
            <input
              placeholder="password"
              type="password"
              name="password"
              className="rounded-lg border-[1px] border-gray-200 bg-gray-300 p-2 text-sm text-gray-100 placeholder-gray-200"
            />
            <button
              type="submit"
              className="mt-2 w-full self-center rounded-lg bg-red-500 p-2 text-sm text-gray-100"
            >
              LOGIN
            </button>
          </div>
          <span className="text-xs text-gray-100">
            <Link to="#" className="underline">
              Sign up
            </Link>{" "}
            if you don't have an account yet.
          </span>
        </Form>
      </div>
    </>
  );
}
