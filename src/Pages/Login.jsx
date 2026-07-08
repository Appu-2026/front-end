import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Pages/login.css'
import axios from 'axios'
import ForgotPassword from './Forgot';
const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();

    const [useremail, setUseremail] = useState('')
    const [userpassword, setUserpassword] = useState('')
    const [submitAttempted, setSubmitAttempted] = useState(false)
    const [userpasswordError, setUserpasswordError] = useState(false)
    const [useremailerror, setUserEmailError] = useState(false)
    const [chake, setChake] = useState(false)
    const [open, setOpen] = useState(false)

    console.log(apiUrl);
    const API_URLS = apiUrl + "/api/newusers"


    const handlesubmit = async (e) => {
        e.preventDefault()
        setSubmitAttempted(true)
        const playload = { userpassword, useremail }
        if (!useremail) {
            setUserEmailError("please enter your useremail")
            return
        } if (!userpassword) {
            setUserpasswordError("please enter password")
            return
        }
        try {
            const response = await axios.post(API_URLS, playload);
            console.log(response)
            const { message, success, jwtToken, username, useremail } = response.data
            if (success) {
                localStorage.setItem("jwtToken", jwtToken);
                localStorage.setItem("username", username);
                localStorage.setItem("useremail", useremail);
                alert(message)
                setTimeout(() => {
                    navigate('/aboutkc')
                }, 1000)
            } else {
                alert(message || "Login failed");
            }
            return;
        } catch (error) {
            console.log("ch-err", error)
            const errorMessage = error.response?.data?.errorMessage || error.message || "An error occurred";
            alert(errorMessage)
            setChake(false)
        }

    }


    return (
        <div className='sign_in'>
            <form className='signin_form' onSubmit={handlesubmit}>
                <h2>Welcome back</h2>
                <h6>please enter your details</h6>

                <div className='input-group '>
                    <label htmlFor="" >User Email:</label>
                    <input type="text" onChange={(e) => setUseremail(e.target.value)} value={useremail} placeholder="Enter your Email" />
                    {submitAttempted && <span style={{ color: 'red', fontSize: 10 }} > {useremailerror}</span>}
                </div>
                <div className='input-group '>
                    <label htmlFor="" > User Password:</label>
                    <input type="password" onChange={(e) => setUserpassword(e.target.value)} value={userpassword} placeholder="Enter your Password" />
                    {<span style={{ color: 'red', fontSize: 10 }} > {userpasswordError}</span>}
                </div>

                <div className='checkbox'>
                    <div>
                        <input type="checkbox" onChange={(e) => setChake(e.target.checked)} checked={chake} required /><label>remember Me:</label>

                    </div>
                    <div>
                        <Link href='' onClick={() => setOpen(true)}>Forgot password</Link>
                    </div>
                </div>
                <div className='btn_login login'>
                    <button type='submit' >login</button>
                    <button >sign in with google</button>
                </div>

                <div className='sign_up'>
                    <p>Don't have an account?</p> <a href='/singup'>sigh up</a>
                </div>
            </form>
            {open &&
                <ForgotPassword setOpen={setOpen} />}
        </div >

    )
};

export default Login
