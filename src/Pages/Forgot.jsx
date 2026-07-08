import axios from "axios";
import React, { useState } from "react";
import '../Pages/forgot.css'


function ForgotPassword({ setOpen }) {

    const [useremail, setUserEmail] = useState("")
    const [newPassword, setNewpassword] = useState("")
    const [confirmpassword, setConfirmpassword] = useState("")
    const [submitAttempted, setSubmitAttempted] = useState(false)
    const [useremailerror, setUserEmailError] = useState("")
    const [userpassworderror, setUserPasswordError] = useState("")

    const API = 'http://localhost:8000/api/update/newuser';

    const heandelValueOnsubimt = async (e) => {
        e.preventDefault()
        setSubmitAttempted(true)
        const playload = { useremail, newPassword }
        if (!useremail) {
            setUserEmailError("please enter Useremail")
        } if (!newPassword) {
            setUserPasswordError("please enter password")
        } if (newPassword !== confirmpassword) {
            setUserPasswordError("please enter same password")
        }
        try {
            const response = await axios.put(API, playload)
            console.log(response)
            const { message } = response.data
            alert(message)
            handelback()

        } catch (error) {
            alert(error)
        }

    }
    const handelback = () => {
        setOpen(false)
    }


    return (
        <dialog id="myModal" open={true} >
            <h2>Creat New Password!</h2>
            <form className="submit-form" onSubmit={heandelValueOnsubimt}>
                <div>
                    <label>USENAME :</label>
                    <input type="text" onChange={(e) => setUserEmail(e.target.value)} placeholder="useremail"></input>
                </div>
                <div>
                    <label>NEW PASSWORD</label>
                    <input type="password" onChange={(e) => setNewpassword(e.target.value)} placeholder="new password"></input>
                </div>
                <div>
                    <label>CONFIRM NEW PASSWORD</label>
                    <input type="password" onChange={(e) => setConfirmpassword(e.target.value)} placeholder="confirm new user" ></input>
                </div>
                <button type="submit" className="submit-btn" >submit</button>
            </form>
            <div className="close_btn">
                <button id="closeModal" className="click-back" onClick={handelback}>Close</button>
            </div>



        </dialog>





    )
}
export default ForgotPassword
