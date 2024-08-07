import {
  Form,
  Link,
  Navigate,
  redirect,
  useNavigation,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVial, faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { RiseLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";

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

    if (!response.ok) {
      return redirect("/login");
    }

    const authToken = response.headers.get("Authorization");
    if (authToken) {
      localStorage.setItem("Authorization", JSON.stringify(authToken));
      return redirect("/dashboard/");
    }
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
  return await login(credentials);
}

export default function Login() {
  const navigation = useNavigation();
  const { isAuthorized } = useAuth();

  if (isAuthorized()) {
    return <Navigate to="/dashboard/" replace={true} />;
  }

  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center bg-gray-500">
        <Form
          method="post"
          className="mt-16 flex w-[20rem] flex-col items-center justify-center gap-4 rounded-lg bg-gray-400 px-6 py-8 md:min-w-[22rem] shadow-sm"
        >
          <div className="mb-2 flex items-center justify-center gap-2 text-gray-100">
            <FontAwesomeIcon
              icon={faVial}
              className="rounded-md border-2 border-gray-100 p-1 text-lg"
            />
            <span className="logo text-4xl">solvent</span>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center rounded-lg border-[1px] border-gray-200 bg-gray-300">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="pl-3 text-gray-200"
              />
              <input
                placeholder="email"
                type="text"
                name="email"
                className="w-[85%] bg-gray-300 p-2 text-sm text-gray-100 placeholder-gray-200 outline-none"
                disabled={navigation.state == "submitting" ? true : false}
                autoComplete="off"
              />
            </div>
            <div className="flex items-center rounded-lg border-[1px] border-gray-200 bg-gray-300">
              <FontAwesomeIcon icon={faKey} className="pl-3 text-gray-200" />
              <input
                placeholder="password"
                type="password"
                name="password"
                className="w-[85%] bg-gray-300 p-2 text-sm text-gray-100 placeholder-gray-200 outline-none"
                disabled={navigation.state == "submitting" ? true : false}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full self-center rounded-lg bg-red-500 p-2 text-sm text-gray-100"
            >
              {navigation.state == "submitting" ? (
                <RiseLoader color="#EFEFEF" size={5} />
              ) : (
                "LOG IN"
              )}
            </button>
          </div>
          <span className="text-xs text-gray-100">
            <Link to="/signup" className="underline">
              Sign up
            </Link>{" "}
            if you don't have an account yet.
          </span>
        </Form>
      </div>
    </>
  );
}
