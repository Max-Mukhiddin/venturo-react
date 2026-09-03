import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import "../../../css/myAccount.css";
import { serverApi } from "../../../lib/config";
import { MyAccountProfile, MyAccountUpdateInput } from "../../../lib/types/member";
import Breadcrumb from "../../components/breadcrumb";
import { useGlobals } from "../../hooks/useGlobals";
import MemberService from "../../services/MemberService";

const initialForm: MyAccountUpdateInput = {
  memberNick: "",
  memberPhone: "",
  memberAddress: "",
  memberDesc: "",
};

export default function MyAccountPage() {
  const { authMember, setAuthMember } = useGlobals();
  const [profile, setProfile] = useState<MyAccountProfile | null>(null);
  const [form, setForm] = useState<MyAccountUpdateInput>(initialForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle");

  const loadProfile = useCallback(() => {
    if (!authMember) return;

    setLoading(true);
    setLoadError(false);

    new MemberService()
      .getMyAccount()
      .then((data) => setProfile(data))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [authMember]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!profile) return;

    setForm({
      memberNick: profile.memberNick,
      memberPhone: profile.memberPhone,
      memberAddress: profile.memberAddress || "",
      memberDesc: profile.memberDesc || "",
    });
  }, [profile]);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSaveState("idle");
  };

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveState("error");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setForm((previous) => ({ ...previous, memberImage: file }));
    setSaveState("idle");
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaveState("idle");

    try {
      const updatedProfile = await new MemberService().updateMyAccount(form);
      setProfile(updatedProfile);
      setForm((previous) => ({ ...previous, memberImage: undefined }));
      setImagePreview(null);
      if (authMember) {
        setAuthMember({
          ...authMember,
          memberNick: updatedProfile.memberNick,
          memberPhone: updatedProfile.memberPhone,
          memberAddress: updatedProfile.memberAddress,
          memberDesc: updatedProfile.memberDesc,
          memberImage: updatedProfile.memberImage,
        });
      }
      setSaveState("success");
    } catch {
      setSaveState("error");
    } finally {
      setSaving(false);
    }
  };

  const avatarSource = imagePreview || (profile?.memberImage ? `${serverApi}/${profile.memberImage}` : null);

  let content: React.ReactNode;
  if (!authMember) {
    content = (
      <section className="ma-message" aria-live="polite">
        <p>Sign in to view and update your account details.</p>
        <Link to="/products">Continue Shopping</Link>
      </section>
    );
  } else if (loading) {
    content = <p className="ma-state">Loading account details...</p>;
  } else if (loadError || !profile) {
    content = <p className="ma-state">Account details could not be loaded. <button onClick={loadProfile}>Retry</button></p>;
  } else {
    content = (
      <section className="ma-profile">
        <aside className="ma-summary">
          {avatarSource ? (
            <img className="ma-avatar" src={avatarSource} alt={`${profile.memberNick}'s profile`} />
          ) : (
            <span className="ma-avatar ma-avatar-fallback" role="img" aria-label="Default profile avatar">
              <AccountCircleOutlinedIcon aria-hidden="true" />
            </span>
          )}
          <h2>{profile.memberNick}</h2>
          <p>Profile image</p>
          <label className="ma-upload">
            Choose Image
            <input type="file" accept="image/*" onChange={selectImage} />
          </label>
          <dl className="ma-readonly">
            <div><dt>Account type</dt><dd>{profile.memberType}</dd></div>
            <div><dt>Account status</dt><dd>{profile.memberStatus}</dd></div>
          </dl>
        </aside>

        <form className="ma-form" onSubmit={saveProfile}>
          <h2>Profile Details</h2>
          <div className="ma-fields">
            <label>Username<input name="memberNick" value={form.memberNick} onChange={updateField} required /></label>
            <label>Phone<input name="memberPhone" value={form.memberPhone} onChange={updateField} required /></label>
            <label className="ma-wide">Address<input name="memberAddress" value={form.memberAddress || ""} onChange={updateField} /></label>
            <label className="ma-wide">Description<textarea name="memberDesc" value={form.memberDesc || ""} onChange={updateField} /></label>
          </div>
          <div className="ma-actions">
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
            {saveState === "success" ? <p className="ma-success">Profile updated.</p> : null}
            {saveState === "error" ? <p className="ma-error">Your profile could not be updated. Please try again.</p> : null}
          </div>
        </form>
      </section>
    );
  }

  return (
    <div className="my-account-page">
      <Breadcrumb heading="My Account" trail={[{ label: "Home", to: "/" }, { label: "My Account" }]} />
      <main className="ma-main">{content}</main>
    </div>
  );
}
