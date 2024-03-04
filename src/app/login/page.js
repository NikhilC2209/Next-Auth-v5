'use client';

import { z } from "zod";

import React, { useState, useEffect, useRef } from 'react'; 
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { FcGoogle } from "react-icons/fc";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaReddit } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";


const initialState = {
	message: "",
}


export default function Login() {

	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState(null);
	const [modal, setModal] = useState(false);

	const handleAuth = (event) => {

		signIn(event.target.name, { callbackUrl: 'http://localhost:3000/dashboard'});
	}

	const handleCredentials = async (prevState, formData) => {

		const response = await signIn("credentials", { 
			username: formData.get("username"),
			password: formData.get("password"),
			redirect: false, 
		});

		if(!!response.error) {
			setModal(true);
			setErrorMessage("Incorrect Username or Password");
			console.log(response.error);
		}
		else {
			router.push('/dashboard');
		}

	}

	const [state, formAction] = useFormState(handleCredentials, initialState);

	const [validUser, isUserValid] = useState(false);
	const [validPass, isPassValid] = useState(false);

	const [userMessage, setUserMessage] = useState("");
	const [passMessage, setPassMessage] = useState("");

	const setValue = (event) => {

		console.log(event.target.value);

		if(event.target.name=="username") {
			checkSchema(event.target.name, event.target.value);
		}
		else {
			checkSchema(event.target.name, event.target.value);
		}
		
	}

	const checkSchema = (field, value) => {
		
		const userSchema = z.string()
					   		.min(5, { message: "Must be 5 or more characters long" });

		const passSchema = z.string()
							.min(8, { message: "Must be 8 or more characters long" })
							.regex(new RegExp(".*[A-Z].*"), { message: "Must conatain one uppercase character" })
							.regex(new RegExp(".*\\d.*"), { message: "Must contains one number" })
							.regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), {message: "Must contain one special character"});

		let res;

		if(field=="username") {
			res = userSchema.safeParse(value);
		}
		else {
			res = passSchema.safeParse(value);
		}

		if(res.error!=undefined) {
			var obj = JSON.parse(res.error);

			console.log(value);

			if(field=="username") {
				isUserValid(false);
				setUserMessage(obj[0].message);
			}
			else {
				isPassValid(false);
				setPassMessage(obj[0].message);
			}
		}
		else {
			if(field=="username") {
				isUserValid(true);
				setUserMessage("");
			}
			else {
				isPassValid(true);
				setPassMessage("");			
			}
		}

	}


	return (
		<>
		 	<h1>Login Page</h1>
			<form className="max-w-sm mx-auto" action={formAction}>
			  <div className="mb-5">
			    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
			    <input type="text" name="username" onChange={setValue} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
			  	<p className="mt-2 text-sm text-red-600 dark:text-red-500">{userMessage}</p>
			  </div>
			  <div className="mb-5">
			    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
			    <input type="password" name="password" onChange={setValue} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
			  	<p className="mt-2 text-sm text-red-600 dark:text-red-500">{passMessage}</p>
			  </div>

			  	{
					(() => {
					if(modal) {
						return (
								<div id="alert-2" className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
								  <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
								    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
								  </svg>
								  <span className="sr-only">Info</span>
								  <div className="ms-3 text-sm font-medium">
								    {errorMessage}
								  </div>
								  <button type="button" onClick={()=> {setModal(false)}} className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
								    <span className="sr-only">Close</span>
								    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
								      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
								    </svg>
								  </button>
								</div>
						)
					}
					})()
				}

			  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
			</form>

				<div className="section-break flex flex-row items-center w-1/3 mx-auto my-4">
				  	<div className="flex-grow border-b-2"></div>
				  	<div className="mx-2 font-serif text-white">OR</div>
				  	<div className="flex-grow border-b-2"></div>
			  	</div>

			  <div className="container mx-auto grid grid-cols-4 gap-2 w-2/3 mt-2">
				<div className="my-2 flex justify-center">
				  	<button onClick={handleAuth} name="google" className="bg-blue-500 flex flex-row items-center hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
					  Login with 
					  <FcGoogle className="mx-2"/> 
					</button>
			    </div>
				<div className="my-2 flex justify-center">
				  	<button onClick={handleAuth} name="reddit" className="bg-blue-500 flex flex-row items-center hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
					  Login with 
					  <FaReddit className="mx-2"/>
					</button>
			    </div>
				<div className="my-2 flex justify-center">
				  	<button onClick={handleAuth} name="github" className="bg-blue-500 flex flex-row items-center hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
					  Login with 
					  <FaGithub className="mx-2"/>
					</button>
			  	</div>				  
			    <div className="my-2 flex justify-center">
				  	<button onClick={handleAuth} name="twitter" className="bg-blue-500 flex flex-row items-center hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
					  Login with 
					  <FaTwitter className="mx-2"/>
					</button>
			  	</div>
			  </div>
		</>
	)
}