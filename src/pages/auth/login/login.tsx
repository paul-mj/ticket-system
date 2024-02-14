import React from "react";
import { Container } from "react-bootstrap";
import AuthHeader from "../auth-layout/auth-header";
import { LoginForm } from "./login-form";
import "./login.scss";

 
const Login = () => {
    return (
        <>
            <div className="login-wrapper h-100">
                <Container className="h-100">
                    <div className="auth-header">
                        <AuthHeader />
                    </div>
                    <div className="auth-form-body h-100">
                        <LoginForm />
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Login;
