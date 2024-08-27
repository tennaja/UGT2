import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserDetail, failRequest } from "../../Redux/Login/Action";
import axios from "axios";
import { useForm } from "react-hook-form";
import { LOGIN_URL } from "../../Constants/ServiceURL";
import { USER_GROUP_MAIN_MODULE } from "../../Constants/Constants";
import UGTLogo from "../assets/UGT-Logo.png";
import { encryption, setCookie } from "../../Utils/FuncUtils";
import { useState } from "react";
import ModalFail from "../Control/Modal/ModalFail";
import * as WEB_URL from "../../Constants/WebURL";
import ModelLoadPage from "../Control/NewLoadDing";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenLoading, setIsOpenLoading] = useState(false);

  const [modalContent, setModalContent] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const decodeJwt = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const onSubmitForm = async (formData) => {
    const loginObjParameter = {
      Username: formData.username,
      // Password: encryption(formData.password)
      Password: formData.password,
    };
    setIsOpenLoading(true);
    await axios
      .post(LOGIN_URL, loginObjParameter, {
        timeout: 10000, // Set a timeout of 10 seconds
      })
      .then((res) => {
        const userObj = decodeJwt(res?.data?.token);
        if (res?.status == 200 || res?.status == 202) {
          dispatch(setUserDetail(userObj));
          localStorage.setItem("user", JSON.stringify(userObj?.data));
          setCookie("token", res?.data?.token);
          // navigate(WEB_URL.DEVICE_LIST);

          // redirect to main module menu
          const userGroupID = userObj?.data?.userGroup.id;
          navigate(
            USER_GROUP_MAIN_MODULE[userGroupID]?.URL ??
              USER_GROUP_MAIN_MODULE[1]?.URL
          );
          setIsOpenLoading(false);
        } else {
          setModalContent(
            "Your transaction has failed. Please go back and try again"
          );
          setIsOpenModal(true);
          setIsOpenLoading(false);

          // return;
        }
      })
      .catch((err) => {
        console.log("err", err);
        if (err?.response?.status == 401) {
          setModalContent("Username or Password incorrect");
        } else {
          setModalContent(
            "Your transaction has failed. Please go back and try again"
          );
        }
        setIsOpenModal(true);
        setIsOpenLoading(false);
      });
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <section
        className={`bg-[url('/login_background.jpeg')] bgImg w-full h-screen bg-center	bg-no-repeat bg-cover bg-gray-50 dark:bg-gray-900`}
      >
        <div className="flex justify-center container mx-auto my-auto w-screen h-screen items-center flex-col">
          <div className="w-full bg-white rounded shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="flex flex-col items-center">
                <img
                  alt={"ig"}
                  // src={"/icon-green-login-1000-px.png"}
                  src={UGTLogo}
                  width={250}
                  height={250}
                  className="ml-7"
                ></img>
              </div>
              <h1 className="mt-2 text-xl font-bold leading-tight tracking-tight text-black md:text-2xl dark:text-white">
                UGT PLATFORM
                <label className="block mb-2 text-sm font-medium text-gray-300 ">
                  Your Gateway to Empowering Sustainability
                </label>
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                {/* <Controller
                                    name="TEST"
                                    control={control}
                                    defaultValue={null}

                                    rules={{
                                        required: "This field is required",

                                    }}

                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id={'TEST'}
                                            options={options}
                                            displayProp={'label'}
                                            valueProp={'value'}
                                            label={'TEST*'}
                                            error={errors.TEST}
                                        // ... other props
                                        />
                                    )}
                                /> */}

                <div>
                  <input
                    type="text"
                    className={` ${
                      errors.username
                        ? "border-1 border-rose-600 rounded block w-full bg-transparent outline-none py-2 px-3 "
                        : "border-1 border-gray-300 rounded block w-full bg-transparent outline-none py-2 px-3"
                    }`}
                    size="small"
                    placeholder="Username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                  {errors.username && (
                    <p className="mt-1 mb-1 text-red-500 text-xs text-left">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    className={` ${
                      errors.password
                        ? "border-1 border-rose-600 rounded block w-full bg-transparent outline-none py-2 px-3 "
                        : "border-1 border-gray-300 rounded block w-full bg-transparent outline-none py-2 px-3"
                    }`}
                    required
                    size="small"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",

                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="mt-1 mb-1 text-red-500 text-xs text-left">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSubmit(onSubmitForm)}
                    style={{ backgroundColor: "#87BE33", color: "white" }}
                    className="w-full h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded focus:shadow-outline hover:bg-indigo-800"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {isOpenModal && (
        <ModalFail
          onClickOk={handleCloseModal}
          title="Oops!"
          content={modalContent}
        />
      )}

      {isOpenLoading && <ModelLoadPage></ModelLoadPage>}
    </>
  );
};

export default LoginForm;
