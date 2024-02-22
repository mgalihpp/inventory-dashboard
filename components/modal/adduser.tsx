import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import type { User } from "@prisma/client";

type ExtendedUser = Omit<User, "id">;

export default function AddUser({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const [user, setUser] = useState<ExtendedUser>({
    email: "",
    password: "",
    role: "CUSTOMER",
    address: "",
    avatar: "",
    fullname: "",
    username: "",
  });

  const [error, setError] = useState("");

  const router = useRouter();

  // Handle change event for input and select elements
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    // Update the state based on the selected value
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        onOpenChange(false);
        setUser({
          fullname: "",
          username: "",
          email: "",
          password: "",
          avatar: "",
          role: "CUSTOMER",
          address: "",
        });

        router.refresh();
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* <!-- Modal toggle --> */}
      <button
        onClick={() => onOpenChange(true)}
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="p-2 rounded-md bg-green-400 text-white font-semibold 
        flex gap-2 text-sm items-center"
        type="button"
      >
        <Plus className="h-4 w-4 self-center" />
        Add Data
      </button>

      {/* <!-- Main modal --> */}
      {open && (
        <div className="relative">
          {/* Overlay */}
          <div className="fixed top-0 right-0 bottom-0 left-0 bg-black opacity-50 z-50"></div>

          {/* Modal */}
          <div
            id="authentication-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center w-full md:max-w-md bg-white rounded-lg shadow dark:bg-gray-700"
          >
            {/* Modal content */}
            <div className="relative w-full">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add User
                </h3>
                <button
                  onClick={() => onOpenChange(false)}
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Form inputs */}

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      User email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="User email"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      User password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="User password"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      User fullname
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      id="fullname"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="User fullname"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      User username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="User username"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      User address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="User address"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Choose a role
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={user.role}
                      onChange={handleChange}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="CUSTOMER">Customer</option>
                    </select>
                  </div>

                  {error && <div className="text-red-500">{error}</div>}

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
