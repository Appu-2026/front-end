import { useEffect, useState } from 'react'
import '../Pages/Signup.css'
import { Link, useNavigate, UNSAFE_decodeViaTurboStream } from 'react-router-dom'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;

function Singup() {
    const [username, setUsername] = useState('')
    const [useremail, setUseremail] = useState('')
    const [userpassword, setUserpassword] = useState('')
    const [reenterpassword, setReenterpassword] = useState('')
    const [submitAttempted, setSubmitAttempted] = useState(false)
    const [userMessageError, setUserMassageError] = useState(false)
    const [usernameerror, setUserNameError] = useState(false)
    const [useremailerror, setUserEmailError] = useState(false)
    const [chake, setChake] = useState(false)

    const navigate = useNavigate();
    const API_URL = apiUrl + "/api/newuser"

    useEffect(() => {
        featchMember()
    }, [])

    const featchMember = () => {
        try {

        } catch (error) {
            console.error(massege("please enetr currect entry"), error)
        }

    }
    const userSubmited = () => {
        setUsername(''),
            setUseremail(''),
            setUserpassword(''),
            setReenterpassword(''),
            setSubmitAttempted(false),
            setChake(false)
    }
    const newLocation = () => {
        navigate('/aboutkc')
    }
    const handlesubmit = async (e) => {
        e.preventDefault()
        setSubmitAttempted(true)
        const playload = { username, useremail, userpassword }
        if (userpassword !== reenterpassword) {
            setUserMassageError("please enter currect password in both")
            return;
        }
        if (!username) {
            setUserNameError("please enter username")
            return;
        }
        if (!useremail) {
            setUserEmailError("please enter useremail")
            return;
        }

        try {
            await axios.post(API_URL, playload)
            newLocation()
            return;
        } catch (error) {
            console.log(error)
            const { message, success } = error.response.data
            if (!success) {
                setTimeout(() => {
                    alert(message)
                }, 500)
            }
            userSubmited()

        }

    }
    return (
        <div className='sign_in'>
            <form className='signin_form' onSubmit={handlesubmit} >
                <h2>REGISTER NOW</h2>
                <div className='input-group '>
                    <label>Enter your Name:</label>
                    <input type='text' onChange={(e) => setUsername(e.target.value)} value={username} placeholder='Enter your Name' />
                    {submitAttempted && <span style={{ color: 'red', fontSize: 10 }} > {usernameerror}</span>}
                </div>
                <div className='input-group '>
                    <label htmlFor="" > Enter Your Email:</label>
                    <input type="text" onChange={(e) => setUseremail(e.target.value)} value={useremail} placeholder="Enter your Email" />
                    {submitAttempted && <span style={{ color: 'red', fontSize: 10 }} > {useremailerror}</span>}
                </div>
                <div className='input-group'>
                    <label htmlFor="" > Enter Your Password:</label>
                    <input type="password" onChange={(e) => setUserpassword(e.target.value)} value={userpassword} placeholder="Enter your Password" />
                    {submitAttempted && <span style={{ color: 'red', fontSize: 10 }} > {userMessageError}</span>}
                </div>
                <div className='input-group '>
                    <label htmlFor="" > conform your Password:</label>
                    <input type="password" onChange={(e) => setReenterpassword(e.target.value)} value={reenterpassword} placeholder="Re-enter your Password" />
                    {submitAttempted && <span style={{ color: 'red', fontSize: 10 }} > {userMessageError}</span>}
                </div>
                <div className='check-box'>
                    <div>
                        <input type="checkbox" checked={chake} onChange={(e) => setChake(e.target.checked)} /><label> Remember me:</label>
                    </div>

                </div>
                <div className='btn_login'>
                    <button type='submit' >sign in</button>
                </div>

            </form>

        </div>
    )
}

export default Singup;