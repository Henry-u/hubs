import React, { useCallback, useReducer, useContext, useEffect } from "react";
import { TERMS, PRIVACY } from "../../constants";
import configs from "../../utils/configs";
import { AuthContext } from "./AuthContext";
import { SignInModal, SignInStep, WaitForVerification, SubmitEmail, BindUser } from "./SignInModal";

const SignInAction = {
  bind: "bind",
  bindFailed: "faild",
  bindStore: "bindStore",
  cancelBind: "cancelBind",
  submitEmail: "submitEmail",
  verificationReceived: "verificationReceived",
  cancel: "cancel"
};

const initialSignInState = {
  step: SignInStep.bind,
  email: "",
  memberId: "",
  sellerId: "",
  storeId: "",
  stores: [],
  message: ""
};

function loginReducer(state, action) {
  switch (action.type) {
    case SignInAction.bind:
      return { step: SignInStep.submit, email: action.email, message: ""};
    case SignInAction.bindStore:
      return { step: SignInStep.bind, email: action.email, message: "", stores: action.stores };
    case SignInAction.bindFailed:
      return { step: SignInStep.bind, email: action.email, message: action.message };
    case SignInAction.cancelBind:
      return { step: SignInStep.bind, email: action.email };
    case SignInAction.submitEmail:
      return { step: SignInStep.waitForVerification, email: action.email };
    case SignInAction.verificationReceived:
      return { ...state, step: SignInStep.complete };
    case SignInAction.cancel:
      return { ...state, step: SignInStep.submit };
  }
}

function useSignIn() {
  const auth = useContext(AuthContext);
  const [state, dispatch] = useReducer(loginReducer, initialSignInState);

  const bindSeller = useCallback(
    (email, password) => {
      auth.bindSeller(email, password).then( stores => {
        dispatch({ type: SignInAction.bindStore, email, message: "", stores});
      }).catch( message => {
        dispatch({ type: SignInAction.bindFailed, message });
      });
    },
    [auth]
  );

  const bindStore = useCallback(
    (email, storeId) => {
      auth.bindStore(storeId).then(() => {
        submitEmail(email);
      }).catch( message => {
        dispatch({ type: SignInAction.bindFailed, message });
      });
    },
    [auth]
  );

  const cancelBind = useCallback(
    (email) => {
      auth.cancelBind().then(() => {
        dispatch({ type: SignInAction.cancelBind, email });
      })
    }
  );

  const submitEmail = useCallback(
    email => {
      auth.signIn(email).then(() => {
        dispatch({ type: SignInAction.verificationReceived });
      });
      dispatch({ type: SignInAction.submitEmail, email });
    },
    [auth]
  );

  const cancel = useCallback(() => {
    cancelBind(state.email);
  }, []);

  return {
    step: state.step,
    email: state.email,
    message: state.message,
    stores: state.stores,
    bindSeller,
    bindStore,
    cancelBind,
    submitEmail,
    cancel
  };
}

export function SignInModalContainer() {
  const qs = new URLSearchParams(location.search);
  const { step, submitEmail, cancel, email, message, stores, bindSeller, bindStore, cancelBind } = useSignIn();
  const redirectUrl = qs.get("sign_in_destination_url") || "/";

  useEffect(() => {
    if (step === SignInStep.complete) {
      window.location = redirectUrl;
    }
  }, [step, redirectUrl]);

  return (
    <SignInModal disableFullscreen>
      {step === SignInStep.bind && (
        <BindUser
          onBindSeller={bindSeller}
          onBindStore={bindStore}
          onBindCancel={cancelBind}
          initialEmail={email}
          stores={stores}
          message={message}
          signInReason={qs.get("sign_in_reason")}
          termsUrl={configs.link("terms_of_use", TERMS)}
          showTerms={configs.feature("show_terms")}
          privacyUrl={configs.link("privacy_notice", PRIVACY)}
          showPrivacy={configs.feature("show_privacy")}
        />
      )}
      {step === SignInStep.submit && (
        <SubmitEmail
          onSubmitEmail={submitEmail}
          onCancel={cancelBind}
          initialEmail={email}
          signInReason={qs.get("sign_in_reason")}
          termsUrl={configs.link("terms_of_use", TERMS)}
          showTerms={configs.feature("show_terms")}
          privacyUrl={configs.link("privacy_notice", PRIVACY)}
          showPrivacy={configs.feature("show_privacy")}
        />
      )}
      {(step === SignInStep.waitForVerification || step === SignInStep.complete) && (
        <WaitForVerification
          onCancel={cancel}
          email={email}
          showNewsletterSignup={configs.feature("show_newsletter_signup")}
        />
      )}
    </SignInModal>
  );
}
