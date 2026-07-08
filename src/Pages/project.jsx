import React, { useState, useEffect } from 'react'
import { UNSAFE_decodeViaTurboStream } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Pages/project.css'
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users';
const API_URL1 = 'http://localhost:8000/api/user';
const API_URLD = 'http://localhost:8000/api/delete/user';
const API_URLU = 'http://localhost:8000/api/update/user';

function About() {
    const [data, setData] = useState([]);
    const [currentUser, setCurrenUser] = useState(null);



    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(API_URL);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data from backend", error);
        }
    };

    const editUser = async (id) => {
        try {
            const response = await axios.put(`${API_URLU}/${id}`);
            if (response.data) {
                setCurrenUser(response.data); // Set the actual user data payload
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    }
    const deletUser = async (id) => {
        if (window.confirm("are you sure to delet thid item?")) {
            try {
                await axios.delete(`${API_URLD}/${id}`)
                fetchMembers();

            } catch (error) {
                console.error("Error deleting user", error)
            }
        }
    };





    return (
        <>
            <AddMember setData={setData} currentUser={currentUser} setCurrenUser={setCurrenUser} fetchMembers={fetchMembers} />
            <div className='data_page'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>DOB</th>
                            <th>Job Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            data.map((current) => (
                                <tr key={current.email || current._id}>
                                    <td>{current.name}</td>
                                    <td>{current.email}</td>
                                    <td>{current.mobile}</td>
                                    <td>{current.jobtype}</td>
                                    <td>{current.dob}</td>
                                    <td >
                                        <button onClick={() => pictureUser(current._id)} >pic</button>||
                                        <button onClick={() => editUser(current._id)} ><i className="fa-solid fa-pen-to-square"></i></button>||
                                        <button onClick={() => deletUser(current._id)} ><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

        </>
    )
};

function AddMember({ setData, currentUser, setCurrenUser, fetchMembers, handleUpload }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [jobtype, setJobType] = useState('');
    const [id, setId] = useState(0);
    const [chake, setChake] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [pictur, setPictur] = useState(null);
    const [preview, setPreview] = useState(null);
    const [stutus, setStutus] = useState("")

    React.useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setEmail(currentUser.email || "");
            setMobile(currentUser.mobile || "");
            setDob(currentUser.dob || "");
            setJobType(currentUser.jobtype || "Full_Time");
            setId(currentUser._id || null)
        }
    }, [currentUser]);

    async function hendelValues(event) {
        event.preventDefault();
        setSubmitAttempted(true)
        if (!name || !email || !mobile || !dob) return;
        const payload = { name, email, mobile, dob, jobtype };
        try {
            if (id) {
                await axios.put(`${API_URLU}/${id}`, payload);
            } else {
                await axios.post(API_URL1, payload);
            }
            fetchMembers();
            backUser()

        } catch (error) {
            console.error("error submitting error", error)

        }
    }


    const backUser = () => {
        setName('');
        setEmail('');
        setMobile('');
        setDob('');
        setJobType('');
        setId(null);
        setChake(false);
        setSubmitAttempted(false);
        setPictur("")
        setCurrenUser(null);
    }
    const option = [
        { value: "bangalur", label: "bangalur" },
        { value: "mangalur", label: "mangalur" },
        { value: "hubballi", label: "hubballi" },
        { value: "ballari", label: "ballari" },
        { value: "maisur", label: "maisur" }
    ];
    const handleFileChange = (e) => {
        console.log(e.target.value)
        const selectedFile = e.target.value;
        if (selectedFile) {
            setPictur(selectedFile);
            setPreview(URL.createObjectURL(selectedFile))
        }
        const handleUpload = async () => {
            if (!file) {
                setStutus('please select a file first.');
                return;
            }
            setStutus('uploding...');
            const formDate = new FormDate();
            formDate.append('image', file);
            try {
                const response = await axios('https://', formDate, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                });
                setStatus('Upload successful!');
                console.log('Server Response:', response.data);
            } catch (error) {
                setStutus('upload failed. please try again')
                console.error("error uploading file", error)
            }
        }

    }


    return (
        <>
            <form className='main_page' onSubmit={hendelValues}>
                <div className='first_line'>
                    <span>
                        <label>full Name:<input type='text' name="name" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} value={name} /></label>
                        {submitAttempted && !name && <p style={{ color: 'red', fontSize: 10 }}>Plese enter the name</p>}
                    </span>
                    <span className='uploding_file'>
                        <label className='first_img'>Profile fic:<input type='file' accept="image/*"
                            onChange={handleFileChange} />
                            {preview && (
                                <div >
                                    <img src={preview} alt='Preview' style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            )}
                            {!pictur ? " " : <button type='button' onClick={handleUpload}>upload</button>}
                        </label>
                        {submitAttempted && stutus && <p style={{ color: 'red', fontSize: '10px' }}>{stutus}</p>}
                    </span>
                </div>

                <div className='first_main'>
                    <span><label>Moble No: <input type='text' name="mobile" placeholder='Enter your Phone no' onChange={(e) => setMobile(e.target.value)} value={mobile} /></label>
                        {submitAttempted && !mobile && <p style={{ color: 'red', fontSize: 10 }}>Plese enter the phone number</p>}
                    </span>
                    <span><label>Email id: <input type='text' name="email" placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} /> </label>
                        {submitAttempted && !email && <p style={{ color: 'red', fontSize: 10 }}>Plese enter the Email</p>}
                    </span>

                </div>
                <div className='secend_main'>
                    <div className='job-type'> Job Type:
                        <span>
                            <button type='button' className={jobtype !== 'Full_Time' ? 'btn-normal' : 'btn-active'} onClick={(e) => setJobType(e.target.value)} value="Full_Time">FT</button><> </>
                            <button type='button' className={jobtype !== 'Part_Time' ? 'btn-normal' : 'btn-active'} onClick={(e) => setJobType(e.target.value)} value="Part_Time">PT</button><> </>
                            <button type='button' className={jobtype !== 'Consultant' ? 'btn-normal' : 'btn-active'} onClick={(e) => setJobType(e.target.value)} value="Consultant">Consultant</button>
                            {submitAttempted && !jobtype && <p style={{ color: 'red', fontSize: 10 }}>Please Click Jobtype</p>}
                        </span>

                    </div>
                    <span>
                        <label className='dob-label'>DOB: <input type='date' name='dob' placeholder='Enter your Date of birth' onChange={(e) => setDob(e.target.value)} value={dob} /></label>
                        {submitAttempted && !dob && <p style={{ color: 'red', fontSize: 10 }}>Plese Enter the Date of Birth</p>}
                    </span>
                </div>
                <div className='subbimt_add'>
                    <label>Pref.Locetion: <input
                        type='checkbox'
                        checked={chake}
                        onChange={(e) => setChake(e.target.checked)}
                        required
                    /><select>
                            <option value="" >select your option</option>
                            {option.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}

                        </select>
                    </label>



                    <div className='onchange_btn' ><button type='submit' className='add_button'>
                        {id ? (<><i className="fa-solid fa-right-to-bracket"></i>Update Member</>) : (<><i className="fa-solid fa-user-plus"></i> Add Member</>)}</button>
                        {id ? <button onClick={backUser}><i className="fa-solid fa-delete-left"></i>Back</button> : ''}
                    </div>

                </div>
            </form >
        </>

    )
}

export default About
