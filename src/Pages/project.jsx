import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Pages/project.css'
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = apiUrl + '/api/users';
const API_URL1 = apiUrl + '/api/user';
const API_URLD = apiUrl + '/api/delete/user';
const API_URLU = apiUrl + '/api/update/user';

function About() {
    const [data, setData] = useState([]);
    const [currentUser, setCurrenUser] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data from backend", error);
        }
    };

    const editUser = async (id) => {
        try {
            const token = localStorage.getItem("jwtToken");
            // Corrected to GET method to fetch details of a specific user
            const response = await axios.get(`${API_URL1}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
                const token = localStorage.getItem("jwtToken");
                await axios.delete(`${API_URLD}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchMembers();
            } catch (error) {
                console.error("Error deleting user", error);
            }
        }
    };

    const pictureUser = (id) => {
        const user = data.find(u => u._id === id);
        if (user && user.image) {
            alert(`Profile image path: ${user.image}`);
        } else {
            alert("No profile picture uploaded for this member.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center p-3 mb-4 bg-dark text-white rounded">
                <h4 className="mb-0">Member Dashboard</h4>
                <div className="d-flex align-items-center">
                    <span className="me-3">Welcome, {localStorage.getItem("username") || "User"}!</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <AddMember setData={setData} currentUser={currentUser} setCurrenUser={setCurrenUser} fetchMembers={fetchMembers} />
            <div className='data_page'>
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>DOB</th>
                            <th>Job Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((current) => (
                                <tr key={current.email || current._id}>
                                    <td>
                                        {current.image ? (
                                            <img src={`${apiUrl}${current.image}`} alt={current.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                                                {current.name ? current.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                        )}
                                    </td>
                                    <td>{current.name}</td>
                                    <td>{current.email}</td>
                                    <td>{current.mobile}</td>
                                    <td>{current.dob}</td>
                                    <td>{current.jobtype}</td>
                                    <td className='acction-btn'>
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
    );
}

function AddMember({ setData, currentUser, setCurrenUser, fetchMembers }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [jobtype, setJobType] = useState('Full_Time');
    const [id, setId] = useState(null);
    const [chake, setChake] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [pictur, setPictur] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setEmail(currentUser.email || "");
            setMobile(currentUser.mobile || "");
            setDob(currentUser.dob || "");
            setJobType(currentUser.jobtype || "Full_Time");
            setId(currentUser._id || null);
            setPreview(currentUser.image ? `${apiUrl}${currentUser.image}` : null);
            setPictur(null);
        }
    }, [currentUser]);

    async function hendelValues(event) {
        event.preventDefault();
        setSubmitAttempted(true);
        if (!name || !email || !mobile || !dob) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("dob", dob);
        formData.append("jobtype", jobtype);
        if (pictur) {
            formData.append("image", pictur);
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
            }
        };

        try {
            if (id) {
                await axios.put(`${API_URLU}/${id}`, formData, config);
            } else {
                await axios.post(API_URL1, formData, config);
            }
            fetchMembers();
            backUser();
        } catch (error) {
            console.error("error submitting member", error);
        }
    }

    const backUser = () => {
        setName('');
        setEmail('');
        setMobile('');
        setDob('');
        setJobType('Full_Time');
        setId(null);
        setChake(false);
        setSubmitAttempted(false);
        setPictur(null);
        setPreview(null);
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
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setPictur(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
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
                        <label className='first_img'>Profile pic:<input type='file' accept="image/*" onChange={handleFileChange} />
                            {preview && (
                                <div className="mt-2">
                                    <img src={preview} alt='Preview' style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            )}
                        </label>
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
                            <button type='button' className={jobtype !== 'Full_Time' ? 'btn-normal' : 'btn-active'} onClick={() => setJobType("Full_Time")}>FT</button><> </>
                            <button type='button' className={jobtype !== 'Part_Time' ? 'btn-normal' : 'btn-active'} onClick={() => setJobType("Part_Time")}>PT</button><> </>
                            <button type='button' className={jobtype !== 'Consultant' ? 'btn-normal' : 'btn-active'} onClick={() => setJobType("Consultant")}>Consultant</button>
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

                    <div className='onchange_btn'>
                        <button type='submit' className='add_button'>
                            {id ? (<><i className="fa-solid fa-right-to-bracket"></i>Update Member</>) : (<><i className="fa-solid fa-user-plus"></i> Add Member</>)}
                        </button>
                        {id ? <button type='button' onClick={backUser}><i className="fa-solid fa-delete-left"></i>Back</button> : ''}
                    </div>
                </div>
            </form >
        </>
    );
}

export default About;
