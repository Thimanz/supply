import { useRef, useState, useEffect } from "react";
import {
    faCheck,
    faTimes,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import validator from "validator";
import isValidCpf from "../../utils/isValidCpf";

import { useNavigate } from "react-router-dom";

import InputMask from "react-input-mask";

import { motion as m } from "framer-motion";

import { postNewUserAccount } from "../../services/authService";
import { useDispatch } from "react-redux";

import { ToastContainer, toast, Bounce } from "react-toastify";

const RegisterForm = () => {
    const navigate = useNavigate();

    const userRef = useRef();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [cpf, setCpf] = useState("");
    const [validCpf, setValidCpf] = useState(false);
    const [cpfFocus, setCpfFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const validateEmail = (email) => {
        setValidEmail(validator.isEmail(email));
    };

    const validatePwd = (pwd) => {
        setValidPwd(validator.isStrongPassword(pwd));
        setValidMatch(matchPwd === pwd && validator.isStrongPassword(matchPwd));
    };

    const validateMatch = (matchPwd) => {
        setValidMatch(matchPwd === pwd && validator.isStrongPassword(matchPwd));
    };

    const validateCPF = (cpfStr) => {
        const cpf = cpfStr.replace(/[^0-9]/g, "");
        setValidCpf(isValidCpf(cpf));
    };

    const dispatch = useDispatch();

    const sendNewUser = async () => {
        toast.dismiss();
        if (!(validEmail && validPwd && validMatch && validCpf)) {
            toast.error("Há campos a serem corrigidos", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }
        try {
            const newUserResponse = await dispatch(
                postNewUserAccount({
                    nome: name,
                    cpf,
                    email,
                    senha: pwd,
                    senhaConfirmacao: matchPwd,
                })
            ).unwrap();
            localStorage.setItem("accessToken", newUserResponse.accessToken);
            localStorage.setItem("refreshToken", newUserResponse.refreshToken);
            localStorage.setItem(
                "userEmail",
                newUserResponse.usuarioToken.email
            );
            navigate("/inicio", { replace: true });
        } catch (error) {
            error.errors.mensagens.forEach((mensagem) => {
                toast.error(mensagem, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            });
        }
    };

    return (
        <>
            <ToastContainer />
            <m.section
                initial={{
                    x: "95%",
                    style: {
                        border: "5%",
                    },
                }}
                animate={{
                    x: 0,
                    style: {
                        borderBottomLeftRadius: "none",
                        borderTopLeftRadius: "none",
                    },
                }}
                transition={{
                    duration: 1,
                    bounce: 0.2,
                    stiffness: 30,
                    type: "spring",
                }}
                className="register-area"
            >
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="register-area"
                >
                    <h1 className="register-h1">Cadastre-se</h1>
                    <form
                        className="name-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendNewUser();
                        }}
                    >
                        <label htmlFor="name">Nome:</label>
                        <input
                            className="name-input"
                            type="text"
                            id="name"
                            ref={userRef}
                            autoComplete="off"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    </form>
                    <div className="sectioned-forms">
                        <div className="left-form">
                            <form
                                className="email-form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendNewUser();
                                }}
                            >
                                <label htmlFor="email">
                                    E-mail:&nbsp;
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={
                                            validEmail ? "valid" : "hide"
                                        }
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={
                                            validEmail ? "hide" : "invalid"
                                        }
                                    />
                                </label>
                                <input
                                    className="email-input"
                                    type="text"
                                    id="email"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        validateEmail(e.target.value);
                                    }}
                                    required
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={(e) => {
                                        setEmailFocus(false);
                                    }}
                                />
                                <p
                                    className={
                                        emailFocus && !validEmail
                                            ? "instructions"
                                            : "offscreen"
                                    }
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Escreva um e-mail válido.
                                </p>
                            </form>
                            <form
                                className="cpf-form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendNewUser();
                                }}
                            >
                                <label htmlFor="cpf">
                                    CPF:&nbsp;
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={validCpf ? "valid" : "hide"}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={
                                            validCpf ? "hide" : "invalid"
                                        }
                                    />
                                </label>
                                <InputMask
                                    className="cpf-input"
                                    mask="999.999.999-99"
                                    type="text"
                                    id="cpf"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setCpf(e.target.value);
                                        validateCPF(e.target.value);
                                    }}
                                    required
                                    onFocus={() => setCpfFocus(true)}
                                    onBlur={(e) => {
                                        setCpfFocus(false);
                                    }}
                                />
                                <p
                                    className={
                                        cpfFocus && !validCpf
                                            ? "instructions"
                                            : "offscreen"
                                    }
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Escreva um CPF válido.
                                </p>
                            </form>
                        </div>
                        <div className="right-forms">
                            <form
                                className="password-form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendNewUser();
                                }}
                            >
                                <label htmlFor="pwd">
                                    Senha:&nbsp;
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={validPwd ? "valid" : "hide"}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={
                                            validPwd ? "hide" : "invalid"
                                        }
                                    />
                                </label>
                                <input
                                    className="password-input"
                                    type="password"
                                    id="password"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setPwd(e.target.value);
                                        validatePwd(e.target.value);
                                    }}
                                    required
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={(e) => {
                                        setPwdFocus(false);
                                    }}
                                />
                                <p
                                    className={
                                        pwdFocus && !validPwd
                                            ? "instructions"
                                            : "offscreen"
                                    }
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} />A
                                    senha deve ter no mínimo 8 caracteres,{" "}
                                    <br /> caracter especial e letra maiúscula
                                </p>
                            </form>
                            <form
                                className="password-form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendNewUser();
                                }}
                            >
                                <label htmlFor="matchpwd">
                                    Confirmar Senha:&nbsp;
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className={
                                            validMatch ? "valid" : "hide"
                                        }
                                    />
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className={
                                            validMatch ? "hide" : "invalid"
                                        }
                                    />
                                </label>
                                <input
                                    className="password-input"
                                    type="password"
                                    id="matchPwd"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setMatchPwd(e.target.value);
                                        validateMatch(e.target.value);
                                    }}
                                    required
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={(e) => {
                                        setMatchFocus(false);
                                    }}
                                />
                                <p
                                    className={
                                        matchFocus && !validMatch
                                            ? "instructions"
                                            : "offscreen"
                                    }
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    As senhas não são iguais
                                </p>
                            </form>
                        </div>
                    </div>
                    <div className="lower-form">
                        <button className="login-btn" onClick={sendNewUser}>
                            Cadastrar-se
                        </button>
                    </div>
                </m.div>
            </m.section>
        </>
    );
};

export default RegisterForm;
