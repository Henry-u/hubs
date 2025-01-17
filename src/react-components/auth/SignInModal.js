import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CloseButton } from "../input/CloseButton";
import { Modal } from "../modal/Modal";
import { FormattedMessage, useIntl, defineMessages } from "react-intl";
import { CancelButton, NextButton, ContinueButton } from "../input/Button";
import { TextInputField } from "../input/TextInputField";
import { RadioInputField } from "../input/RadioInputField";
import { RadioInputOption } from "../input/RadioInput";
import { SelectInputField } from "../input/SelectInputField";
import { Column } from "../layout/Column";
import { LegalMessage } from "./LegalMessage";
import styles from "./SignInModal.scss";

export const SignInStep = {
  bind: "bind",
  submit: "submit",
  waitForVerification: "waitForVerification",
  complete: "complete"
};

export const SignInMessages = defineMessages({
  pin: {
    id: "sign-in-modal.signin-message.pin",
    defaultMessage: "You'll need to sign in to pin objects."
  },
  unpin: {
    id: "sign-in-modal.signin-message.unpin",
    defaultMessage: "You'll need to sign in to un-pin objects."
  },
  changeScene: {
    id: "sign-in-modal.signin-message.change-scene",
    defaultMessage: "You'll need to sign in to change the scene."
  },
  roomSettings: {
    id: "sign-in-modal.signin-message.room-settings",
    defaultMessage: "You'll need to sign in to change the room's settings."
  },
  closeRoom: {
    id: "sign-in-modal.signin-message.close-room",
    defaultMessage: "You'll need to sign in to close the room."
  },
  muteUser: {
    id: "sign-in-modal.signin-message.mute-user",
    defaultMessage: "You'll need to sign in to mute other users."
  },
  kickUser: {
    id: "sign-in-modal.signin-message.kick-user",
    defaultMessage: "You'll need to sign in to kick other users."
  },
  addOwner: {
    id: "sign-in-modal.signin-message.add-owner",
    defaultMessage: "You'll need to sign in to assign moderators."
  },
  removeOwner: {
    id: "sign-in-modal.signin-message.remove-owner",
    defaultMessage: "You'll need to sign in to assign moderators."
  },
  createAvatar: {
    id: "sign-in-modal.signin-message.create-avatar",
    defaultMessage: "You'll need to sign in to create avatars."
  },
  remixAvatar: {
    id: "sign-in-modal.signin-message.remix-avatar",
    defaultMessage: "You'll need to sign in to remix avatars."
  },
  remixScene: {
    id: "sign-in-modal.signin-message.remix-scene",
    defaultMessage: "You'll need to sign in to remix scenes."
  },
  favoriteRoom: {
    id: "sign-in-modal.signin-message.favorite-room",
    defaultMessage: "You'll need to sign in to add this room to your favorites."
  },
  favoriteRooms: {
    id: "sign-in-modal.signin-message.favorite-rooms",
    defaultMessage: "You'll need to sign in to add favorite rooms."
  },
  tweet: {
    id: "sign-in-modal.signin-message.tweet",
    defaultMessage: "You'll need to sign in to send tweets."
  }
});

export function BindUser({ 
    onBindMember, onBindSeller, onBindStore, onBindCancel,
    initialEmail, message, bindType, stores, privacyUrl, termsUrl }) {
  const intl = useIntl();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [type, setType] = useState(bindType);
  const [storeOptions, setStoreOptions] = useState([]);
  const [storeId, setStoreId] = useState("");
  const selectStore = (bindType === "1" && stores && stores.length > 0);

  const onBindForm = useCallback(
    e => {
      e.preventDefault();
      if (type === "0") {
        onBindMember(email, password);
      } else {
        if (storeId) {
          onBindStore(email, storeId);
        } else {
          onBindSeller(email, password);
        }
      }
    },
    [onBindMember, onBindSeller, onBindStore, email, password, type, storeId]
  );

  const onChangeEmail = useCallback(
    e => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  const onChangePassword = useCallback(
    e => {
      setPassword(e.target.value);
    },
    [setPassword]
  );

  const onChangeStore = useCallback(
    value => {
      setStoreId(value);
    },
    [setStoreId]
  );

  const onCancel = useCallback(
    () => {
      onBindCancel(email, type);
    },
    [onBindCancel]
  );

  useEffect(() => {
    if (selectStore) {
      let options = [];
      stores.map(store => {
        options.push({
          value: store.id,
          label: store.name
        })
      })
      setStoreOptions([...options]);
    }
  }, [bindType, stores]);

  return (
    <Column center padding as="form" onSubmit={onBindForm}>
      {
        !selectStore ? (
          <React.Fragment>
            <p>Please Bind your account As</p>
            <RadioInputField>
              <RadioInputOption
                name="bind_type"
                value="0"
                label="Student"
                onChange={() => setType("0")}
                checked={type === "0"}
              />
              <RadioInputOption
                name="bind_type"
                value="1"
                label="Teacher"
                onChange={() => setType("1")}
                checked={type === "1"}
              />
            </RadioInputField>
            <TextInputField
              name="email"
              type="email"
              required
              value={email}
              onChange={onChangeEmail}
              placeholder="example@example.com"
            />
            <TextInputField
              name="password"
              type="password"
              required
              value={password}
              onChange={onChangePassword}
              placeholder="your password"
            />
            <p style={{color: 'red'}}>{message}</p>
          </React.Fragment>
        ) : (
          storeOptions && storeOptions.length > 0 && <SelectInputField
            options={storeOptions}
            onChange={onChangeStore}
          />
        )
      }
      <p>
        <small>
          <LegalMessage termsUrl={termsUrl} privacyUrl={privacyUrl} />
        </small>
      </p>
      <div className={styles.buttonGroup}>
        {selectStore && <CancelButton preset="cancel" onClick={onCancel} />}
        <NextButton type="submit" />
      </div>
    </Column>
  );
}

BindUser.defaultProps = {
  bindType: "0",
  initialEmail: "",
  message: ""
};

BindUser.propTypes = {
  message: PropTypes.string,
  bindType: PropTypes.string,
  stores: PropTypes.array,
  termsUrl: PropTypes.string,
  privacyUrl: PropTypes.string,
  initialEmail: PropTypes.string,
  onBindMember: PropTypes.func.isRequired,
  onBindSeller: PropTypes.func.isRequired,
  onBindStore: PropTypes.func.isRequired,
  onBindCancel: PropTypes.func.isRequired,
};

export function SubmitEmail({ onSubmitEmail, onCancel, initialEmail, bindType, privacyUrl, termsUrl, message }) {
  const intl = useIntl();

  const [email, setEmail] = useState(initialEmail);

  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      onSubmitEmail(email);
    },
    [onSubmitEmail, email]
  );

  const onChangeEmail = useCallback(
    e => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  const onCancelHub = useCallback(
    () => {
      onCancel(email, bindType);
    },
    [onCancel]
  );

  return (
    <Column center padding as="form" onSubmit={onSubmitForm}>
      <p>
        {message ? (
          intl.formatMessage(message)
        ) : (
          <FormattedMessage id="sign-in-modal.prompt" defaultMessage="Please Sign In" />
        )}
      </p>
      <TextInputField
        name="email"
        type="email"
        required
        value={email}
        onChange={onChangeEmail}
        placeholder="example@example.com"
      />
      <p>
        <small>
          <LegalMessage termsUrl={termsUrl} privacyUrl={privacyUrl} />
        </small>
      </p>
      <div className={styles.buttonGroup}>
        <CancelButton preset="cancel" onClick={onCancelHub} />
        <NextButton type="submit" />
      </div>
    </Column>
  );
}

SubmitEmail.defaultProps = {
  initialEmail: ""
};

SubmitEmail.propTypes = {
  message: PropTypes.object,
  termsUrl: PropTypes.string,
  privacyUrl: PropTypes.string,
  initialEmail: PropTypes.string,
  onSubmitEmail: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export function WaitForVerification({ email, onCancel, showNewsletterSignup }) {
  return (
    <Column center padding>
      <FormattedMessage
        id="sign-in-modal.wait-for-verification"
        defaultMessage="<p>Email sent to {email}!</p><p>To continue, click on the link in the email using your phone, tablet, or PC.</p><p>No email? You may not be able to create an account.</p>"
        // eslint-disable-next-line react/display-name
        values={{ email, p: chunks => <p>{chunks}</p> }}
      />
      {showNewsletterSignup && (
        <p>
          <small>
            <FormattedMessage
              id="sign-in-modal.newsletter-signup-question"
              defaultMessage="Want Hubs news sent to your inbox?"
            />
            <br />
            <a href="https://eepurl.com/gX_fH9" target="_blank" rel="noopener noreferrer">
              <FormattedMessage id="sign-in-modal.newsletter-signup-link" defaultMessage="Subscribe for updates" />
            </a>
          </small>
        </p>
      )}
      <CancelButton onClick={onCancel} />
    </Column>
  );
}

WaitForVerification.propTypes = {
  showNewsletterSignup: PropTypes.bool,
  email: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired
};

export function SignInComplete({ message, onContinue }) {
  const intl = useIntl();

  return (
    <Column center padding>
      <p>
        <b>
          {message ? (
            intl.formatMessage(message)
          ) : (
            <FormattedMessage id="sign-in-modal.complete" defaultMessage="You are now signed in." />
          )}
        </b>
      </p>
      <ContinueButton onClick={onContinue} />
    </Column>
  );
}

SignInComplete.propTypes = {
  message: PropTypes.string,
  onContinue: PropTypes.func.isRequired
};

export function SignInModal({ closeable, onClose, children, ...rest }) {
  return (
    <Modal
      title={<FormattedMessage id="sign-in-modal.title" defaultMessage="Sign In" />}
      beforeTitle={closeable && <CloseButton onClick={onClose} />}
      {...rest}
    >
      {children}
    </Modal>
  );
}

SignInModal.propTypes = {
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
};
