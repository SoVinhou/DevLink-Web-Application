import React, { useEffect, useState } from 'react';
import './JobPage.css'
import './index.css'
import { JobListsEmployment } from './JobListsEmployment';
import { useNavigate } from 'react-router-dom';
import { addCollectionAndDocument, storage } from './routes/utils/firebase';
import { v4 } from "uuid"; 
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import {Link} from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';

function EmploymentOpt() {
    const navigate = useNavigate();

    const [paymentMade, setPaymentMade] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [projectLength, setProjectLength] = useState('');
    const [minPayment, setMinPayment] = useState('');
    const [maxPayment, setMaxPayment] = useState('');
    const [workingHours, setWorkingHours] = useState('');
    const [image, setImageUpload] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const job = {
            type: 'Employment',
            title,
            description,
            skills,
            projectLength,
            minPayment,
            maxPayment,
            workingHours,
            image,
        };
        JobListsEmployment.push(job);
        console.log(JobListsEmployment);
        // get last index in JobLits Array
        const index = JobListsEmployment.length - 1;
        addCollectionAndDocument('employmentJobs', JobListsEmployment[index]);
        navigate('/');
    };

    const handlePaymentClick = () => {
        window.open("http://localhost:3000/PaymentForm", "_blank");
    };

    const handleUpload = async (e) => {
        if (image == null) return;
        const imageRef = ref(storage, `images/${image.name + v4()}`);
        await uploadBytes(imageRef, image);
        console.log('Uploaded Image!');
      
        const dbImage = ref(storage, `images/`);
        listAll(dbImage).then((res) => {
          res.items.forEach((itemRef) => {
            console.log(itemRef.name);
          }); 
        });
      
        const url = await getDownloadURL(imageRef);
        console.log(url);
        window.alert('Image Uploaded Successfully!');
        setImageUpload(url);
    };

    const handleAPI = async () => { 
        console.log(title);
        try{
            setIsLoading(true);

            const res = await axios.post("http://localhost:4000/OpenAI", {
                title: title,
            })

            if (res !== null)
            {
                setDescription(res.data);
                console.log(res.data);
            }

            setIsLoading(false);
        }
        catch (error) {
            console.log("Error", error);
            window.alert("Error");
            setIsLoading(false);
        }

    }

    useEffect(() => {
        let timer = null;

        if (title.length > 3) {
            timer = setTimeout(() => {
                handleAPI();
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [title]);

    useEffect(() => {
        console.log("useEffect");
        const paymentListener = (event) => {
            console.log(event.data);
            if (event.origin === "http://localhost:3000" && event.data === "paymentMade") {
                setPaymentMade(true);
                console.log(paymentMade);
            }
        };
        window.addEventListener("message", paymentListener);
        return () => {
            window.removeEventListener("message", paymentListener);
        };
    }, []);


    return (
        <div className="freelanceBody">
            <div>
                <div className="DescribeYourJob">
                    <h2>Describe Your Job</h2>
                </div>
                <div className="JobDescription">
                    <form onSubmit={handleSubmit}>
                        <label style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "10px" }}>
                            Title/Position
                            <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginTop: "15px", padding: "12px", boxShadow: "0 0 2px" }} />
                        </label>
                        <br />
                        <label style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "10px" }}>
                            Job Description
                            <div style={{ position: "relative" }}>
                                <textarea type="text" name="description" placeholder={"Enter title to get automatically generated job description by GPT 3 ..."} value={description} onChange={(e) => setDescription(e.target.value)} style={{ marginTop: "15px", padding: "10px", boxShadow: "0 0 2px", boxSizing: "border-box", height: "200px", fontFamily: "Arial, sans-serif" }} />
                                {isLoading && (
                                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                                        <CircularProgress />
                                    </div>
                                )}
                            </div>
                        </label>
                        <br />
                        <label style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "10px" }}>
                            Skills
                            <input type="text" name="skills" value={skills} onChange={(e) => setSkills(e.target.value)} style={{ marginTop: "15px", padding: "12px", boxShadow: "0 0 2px" }} placeholder='Please Add Relevant Skills ... ' />
                        </label>
                    </form>

                    <div className="ProjectConditionsBanner">
                        <h2>Project Condition</h2>
                    </div>

                    <div className="ProjectConditions">
                        <form onSubmit={handleSubmit}>
                            <br />
                            <label style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "10px" }}>
                                Project Length
                                <input type="text" name="projectLength" value={projectLength} onChange={(e) => setProjectLength(e.target.value)} style={{ marginTop: "15px", padding: "12px", boxShadow: "0 0 2px" }} />
                            </label>
                            <br />
                            <label style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "-10px" }}>
                                Payment
                            </label>
                            <label style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px", fontStyle: "italic" }}>
                                Min Payment:
                                <input type="text" name="minPayment" value={minPayment} onChange={(e) => setMinPayment(e.target.value)} style={{ marginTop: "15px", padding: "10px", boxShadow: "0 0 2px" }} />
                                <br />
                                Max Payment:
                                <input type="text" name="maxPayment" value={maxPayment} onChange={(e) => setMaxPayment(e.target.value)} style={{ marginTop: "15px", padding: "10px", boxShadow: "0 0 2px" }} />
                            </label>
                            <br />
                            <label style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "10px" }}>
                                Working Hours
                                <input type="text" name="workingHours" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} style={{ marginTop: "15px", padding: "12px", boxShadow: "0 0 2px" }} />
                            </label>
                            <br />
                            <label style={{ marginTop:"0px", fontSize: "25px", fontWeight: "bold", marginLeft:"235px", marginBottom: "10px" }}>
                                Upload Image
                                <input type="file" name="image" onChange={(e) => setImageUpload(e.target.files[0])} style={{ marginTop: "15px", padding: "12px", boxShadow: "0 0 2px", marginBottom: "35px" }} />
                            </label>
                        </form>
                    </div>
                        <button style={{ marginTop:"-20px", fontSize: "20px", padding:"10px 25px", marginBottom:"50px"}} onClick={handleUpload}>Upload Image</button>

                    <div className="MakePaymentBanner">
                        <h2>Payment</h2>
                    </div>
                    <div className="MakePayment">
                        <h3 style={{fontSize: "25px", fontWeight: "bold", textAlign: "center", marginTop:"70px", marginBottom:"70px", fontStyle:"italic"}}> Listing Employment costs 10$.
                            <br /> Please click on the button below to make payment. 
                        </h3>
                        <button style={{ marginTop: "-50px", fontSize: "25px", padding: "10px 25px", marginBottom: "80px" }} type="button" onClick={handlePaymentClick}>
                            Make Payment
                        </button>
                    </div>

                        <button style={{ fontSize: "35px", marginBottom:"100px"}} type="submit" disabled={!paymentMade} onClick={handleSubmit}>POST</button>
                    </div>
            </div>
        </div>
    );
}

export default EmploymentOpt;