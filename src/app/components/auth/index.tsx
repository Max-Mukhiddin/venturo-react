import React, { FormEvent, useCallback, useEffect, useState } from "react";
import "../../../css/auth.css";
import { Messages } from "../../../lib/config";
import { LoginInput, SignupInput } from "../../../lib/types/member";
import { useGlobals } from "../../hooks/useGlobals";
import MemberService from "../../services/MemberService";

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

interface LoginForm {
  memberNick: string;
  memberPassword: string;
}

interface SignupForm extends LoginForm {
  memberPhone: string;
}

const emptyLogin: LoginForm = { memberNick: "", memberPassword: "" };
const emptySignup: SignupForm = {
  memberNick: "",
  memberPhone: "",
  memberPassword: "",
};

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const { setAuthMember } = useGlobals();
  const [loginForm, setLoginForm] = useState<LoginForm>(emptyLogin);
  const [signupForm, setSignupForm] = useState<SignupForm>(emptySignup);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [submitting, setSubmitting] = useState<"login" | "signup" | null>(null);
  const open = loginOpen || signupOpen;

  const closeModal = useCallback(() => {
    handleLoginClose();
    handleSignupClose();
    setLoginError("");
    setSignupError("");
  }, [handleLoginClose, handleSignupClose]);

  useEffect(() => {
    if (!open) {
      setLoginForm(emptyLogin);
      setSignupForm(emptySignup);
      setSubmitting(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeModal, open]);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");

    if (!loginForm.memberNick || !loginForm.memberPassword) {
      setLoginError(Messages.error3);
      return;
    }

    setSubmitting("login");
    try {
      const input: LoginInput = { ...loginForm };
      const member = await new MemberService().login(input);
      setAuthMember(member);
      closeModal();
    } catch {
      setLoginError("Unable to sign in. Please check your details and try again.");
    } finally {
      setSubmitting(null);
    }
  };

  const submitSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupError("");

    if (!signupForm.memberNick || !signupForm.memberPhone || !signupForm.memberPassword) {
      setSignupError(Messages.error3);
      return;
    }

    setSubmitting("signup");
    try {
      const input: SignupInput = { ...signupForm };
      const member = await new MemberService().signup(input);
      setAuthMember(member);
      closeModal();
    } catch {
      setSignupError("Unable to create your account. Please review your details and try again.");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div
      className="auth-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Venturo account access"
      hidden={!open}
    >
      <button className="auth-modal-backdrop" type="button" aria-label="Close authentication" onClick={closeModal} />
      <section className="auth-surface">
        <button className="auth-close" type="button" aria-label="Close authentication" onClick={closeModal}>×</button>
        <div className="auth-forms">
          <form className="auth-form" onSubmit={submitLogin} noValidate>
            <h3>Login</h3>
            <label htmlFor="login-nick">Username <span aria-hidden="true">*</span></label>
            <input
              id="login-nick"
              name="memberNick"
              autoComplete="username"
              value={loginForm.memberNick}
              onChange={(event) => setLoginForm((current) => ({ ...current, memberNick: event.target.value }))}
              required
            />
            <label htmlFor="login-password">Password <span aria-hidden="true">*</span></label>
            <input
              id="login-password"
              name="memberPassword"
              type="password"
              autoComplete="current-password"
              value={loginForm.memberPassword}
              onChange={(event) => setLoginForm((current) => ({ ...current, memberPassword: event.target.value }))}
              required
            />
            {loginError ? <p className="auth-error" role="alert">{loginError}</p> : null}
            <button className="auth-submit" type="submit" disabled={submitting === "login"}>
              {submitting === "login" ? "Signing in..." : "Login"}
            </button>
          </form>
          <form className="auth-form auth-form-register" onSubmit={submitSignup} noValidate>
            <h3>Register</h3>
            <label htmlFor="signup-nick">Username <span aria-hidden="true">*</span></label>
            <input
              id="signup-nick"
              name="memberNick"
              autoComplete="username"
              value={signupForm.memberNick}
              onChange={(event) => setSignupForm((current) => ({ ...current, memberNick: event.target.value }))}
              required
            />
            <label htmlFor="signup-phone">Phone <span aria-hidden="true">*</span></label>
            <input
              id="signup-phone"
              name="memberPhone"
              type="tel"
              autoComplete="tel"
              value={signupForm.memberPhone}
              onChange={(event) => setSignupForm((current) => ({ ...current, memberPhone: event.target.value }))}
              required
            />
            <label htmlFor="signup-password">Password <span aria-hidden="true">*</span></label>
            <input
              id="signup-password"
              name="memberPassword"
              type="password"
              autoComplete="new-password"
              value={signupForm.memberPassword}
              onChange={(event) => setSignupForm((current) => ({ ...current, memberPassword: event.target.value }))}
              required
            />
            <p className="auth-note">Create an account with your Venturo username, phone number, and password.</p>
            {signupError ? <p className="auth-error" role="alert">{signupError}</p> : null}
            <button className="auth-submit" type="submit" disabled={submitting === "signup"}>
              {submitting === "signup" ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
