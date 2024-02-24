"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { PencilLine } from "lucide-react";
import { User } from "@prisma/client";
import { useServerAction } from "@/hooks/useServerAction";
import { EditUser, getUserById } from "@/server/userAction";
import { useRouter } from "next/navigation";
import { useServerFetch } from "@/hooks/useServerFetch";

type ExtendedUser = Omit<User, "id">;

interface DialogState {
  [userId: string]: boolean;
}

export default function EditButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState<DialogState>({});

  // Function to open dialog for a specific
  const openDialog = (userId: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [userId]: true,
    }));
  };

  // Function to close dialog for a specific
  const closeDialog = (userId: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [userId]: false,
    }));
  };

  const [user, setUser] = useState<ExtendedUser>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    address: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update the user state based on the input field name
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const router = useRouter();

  const [runAction, isRunning] = useServerAction(EditUser);

  const handleSubmit = async () => {
    try {
      await runAction({ user, userId }).then((result) => {
        if (result.success) {
          setUser({
            fullname: "",
            username: "",
            email: "",
            password: "",
            avatar: "",
            address: "",
            role: "CUSTOMER",
          });

          closeDialog(userId);

          router.refresh();
        } else {
          setError(result.error as string);
        }
      });
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
    }
  };

  const props = {
    closeDialog,
    handleChange,
    handleSubmit,
    open,
    error,
    setError,
    userId,
    user,
    setUser,
    isRunning,
  };

  return (
    <>
      {/* <!-- Modal toggle --> */}
      <button
        onClick={() => openDialog(userId)}
        data-modal-target="crud-modal"
        data-modal-toggle="crud-modal"
        className="flex items-center gap-2 font-medium bg-blue-500 
        text-white px-4 py-2 rounded-md hover:bg-blue-600"
        type="button"
      >
        <PencilLine className="w-4 h-4" />
        Edit
      </button>

      <MainModal {...props} />
    </>
  );
}

function MainModal({
  open,
  userId,
  error,
  setError,
  closeDialog,
  handleSubmit,
  handleChange,
  user,
  setUser,
  isRunning,
}: {
  open: DialogState;
  userId: string;
  error: string;
  user: ExtendedUser;
  setUser: Dispatch<SetStateAction<ExtendedUser>>;
  setError: Dispatch<SetStateAction<string>>;
  closeDialog: (userId: string) => void;
  handleSubmit: (formdata: FormData) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isRunning: boolean;
}) {
  const [fetchData] = useServerFetch(
    async () => {
      const result = await getUserById(userId);

      return result;
    },
    (result) => {
      if ("error" in result) {
        setError(result.error);
      } else {
        setUser(result);
      }
    }
  );

  useEffect(() => {
    if (open[userId]) {
      fetchData();
    }
  }, [open]);

  return (
    <>
      {open[userId] && (
        <>
          {/* <!-- Overlay --> */}
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"></div>

          {/* <!-- Main modal --> */}
          <div
            id="crud-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden z-50 fixed flex justify-center items-center w-full md:inset-0 h-dvh max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/* <!-- Modal content --> */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Update User
                  </h3>
                  <button
                    onClick={() => closeDialog(userId)}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="crud-modal"
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
                {/* <!-- Modal body --> */}
                <form className="p-4 md:p-5" action={handleSubmit}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2  text-left">
                      <label
                        htmlFor="fullname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Fullname
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        id="fullname"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="User fullname"
                        value={user.fullname ?? ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-span-2  text-left">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={user.email ?? ""}
                        onChange={handleChange}
                        placeholder="User email"
                        required
                      />
                    </div>
                    <div className="col-span-2  text-left">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={user.password ?? ""}
                        onChange={handleChange}
                        placeholder="User password"
                        required
                      />
                    </div>
                    <div className="col-span-2  text-left sm:col-span-1">
                      <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={user.username ?? ""}
                        onChange={handleChange}
                        placeholder="User username"
                        required
                      />
                    </div>
                    <div className="col-span-2  text-left sm:col-span-1">
                      <label
                        htmlFor="role"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option>Select role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="CUSTOMER">Customer</option>
                      </select>
                    </div>
                    <div className="col-span-2  text-left">
                      <label
                        htmlFor="address"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        value={user.address ?? ""}
                        onChange={handleChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="User address"
                      />
                    </div>
                    <div className="col-span-2  text-left">
                      <label
                        htmlFor="avatar"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Avatar
                      </label>
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        onChange={handleChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="User avatar"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm font-semibold">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isRunning}
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
