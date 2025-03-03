import React, { useState } from "react";
// import { personalInfo } from "../../data";
import emailjs from "emailjs-com";
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

const ContactForm = () => {

}

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

const Contact = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);


        // send email using emailjs service
        emailjs.init(EMAILJS_PUBLIC_KEY);
        emailjs
            .send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                // "your_template_id", // Replace with your actual EmailJS Template ID
                {
                    name,
                    email,
                    message
                },
                EMAILJS_PUBLIC_KEY // Replace with your EmailJS Public Key
            )
            .then(
                (response) => {
                    console.log("SUCCESS!", response.status, response.text);
                    Swal.fire({
                        icon: "success",
                        title: "Email sent!",
                        text: "You will receive a confirmation email, I will get back to you as soon as posible."
                    });
                    setIsLoading(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                },
                (error) => {
                    console.log("FAILED...", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "The email was not sent, try reaching me through Linkedin."
                    })
                }
            );
    };

    return (
        <>

            

                

                {/* <div className="contact-text">{personalInfo.contactText}</div>

                <div className="contact-social-container">
                    {Object.values(personalInfo.socialLogos).map(social => (
                        <div className="social-logo-container">
                            <a href={social.link} title={social.link} target="_blank" rel="noopener noreferrer">
                                <img className="contact-social-logo" src={social.logo}/>
                            </a>
                        </div>
                    ))}
                </div> */}
                
                <div className="contact-form-container">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                name="name"
                                onChange={(e) => {setName(e.target.value)}}
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                name="email"
                                onChange={(e) => {setEmail(e.target.value)}}
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label>Message</label>
                            <textarea
                                placeholder="Enter your message"
                                value={message}
                                onChange={(e) => {setMessage(e.target.value)}}
                                minLength={5}
                                required
                            />
                        </div>

                        <button className="custom-button" type="submit" disabled={isLoading}>
                            
                            {!isLoading ? (
                            <>
                            {"Submit"}
                            </>
                        ) : (
                            <div className="custom-button-spinner-container">
                                <ClipLoader
                                    className="custom-button-spinner"
                                    loading={true}
                                    color="white"
                                />
                            </div>
                        )}
                        </button>
                        
                    </form>
                </div>
        </>
    )
};
export default Contact;