import React from "react";
import { Container } from "react-bootstrap";
import AuthHeader from "../auth-layout/auth-header";
import { LoginForm } from "./login-form";
import "./login.scss";
import { LoginPageBg } from "../../../assets/images/png/pngimages";


const Login = () => {
    return (
        <>
            {/*  <div className="login-wrapper h-100">
                <Container className="h-100">
                    <div className="auth-header">
                        <AuthHeader />
                    </div>
                    <div className="auth-form-body h-100">
                        <LoginForm />
                    </div>
                </Container>
            </div> */}

            <div className="lg-wrapper">
                <div className="lg-head">
                    <AuthHeader /> 
                </div>
                <div className="lg-body">
                    <div className="lg-body-wrapper">
                        <div className="plain-img">
                            <img src={LoginPageBg}/>
                        </div>
                        <div className="lg-login-frm">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
 
        </>
    );
};

export default Login;
