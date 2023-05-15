import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import maskEmail from "../../utils/mask-email";
import styles from "./Header.scss";
import { Container } from "./Container";
import { SocialBar } from "../home/SocialBar";
import { SignInButton } from "../home/SignInButton";
import { AppLogo } from "../misc/AppLogo";
import Avatar from 'react-avatar';

export function UserAvatar({userInfo}) {
  return (
    userInfo.avatar ? (
      <div className={styles.avatar}>
        <img src={userInfo.avatar}/>
        <span>{userInfo.name}</span>
      </div>
    ) : (
      <div className={styles.avatar}>
        <Avatar size={30} round="30px" name={userInfo.name} />
        <span>{userInfo.name}</span>
      </div>
    )
  )
}

UserAvatar.propTypes = {
  userInfo: PropTypes.object
}

export function Header({
  showCloud,
  enableSpoke,
  editorName,
  showDocsLink,
  docsUrl,
  showSourceLink,
  showCommunityLink,
  communityUrl,
  isAdmin,
  isSignedIn,
  email,
  userInfo,
  onSignOut,
  isHmc
}) {
  return (
    <header>
      <Container as="div" className={styles.container}>
        <nav>
          <ul>
            <li>
              <a href="/" className={styles.homeLink}>
                {/*
                This forceConfigurableLogo prop is a bit of a hack, since we want the home page on HMC to use our 
                configured logo, which is left-aligned, as opposed to the logo that we typically used for HMC, 
                which is center-aligned.
                */}
                <AppLogo forceConfigurableLogo />
              </a>
            </li>
            {enableSpoke && (
              <li>
                <a href="/spoke">
                  {isHmc ? <FormattedMessage id="header.spoke" defaultMessage="Spoke" /> : editorName}
                </a>
              </li>
            )}
            {showDocsLink && (
              <li>
                <a href={docsUrl}>
                  <FormattedMessage id="header.docs" defaultMessage="Guides" />
                </a>
              </li>
            )}
            {showSourceLink && (
              <li>
                <a href="https://github.com/mozilla/hubs">
                  <FormattedMessage id="header.source" defaultMessage="Developers" />
                </a>
              </li>
            )}
            {showCommunityLink && (
              <li>
                <a href={communityUrl}>
                  <FormattedMessage id="header.community" defaultMessage="Community" />
                </a>
              </li>
            )}
            {showCloud && (
              <li>
                <a href="/cloud">
                  <FormattedMessage id="header.cloud" defaultMessage="Hubs Cloud" />
                </a>
              </li>
            )}
            {isHmc && (
              <li>
                <a href="/labs">
                  <FormattedMessage id="header.labs" defaultMessage="Labs" />
                </a>
              </li>
            )}
            {isAdmin && (
              <li>
                <a href="/admin" rel="noreferrer noopener">
                  <i>
                    <FontAwesomeIcon icon={faCog} />
                  </i>
                  &nbsp;
                  <FormattedMessage id="header.admin" defaultMessage="Admin" />
                </a>
              </li>
            )}
          </ul>
        </nav>
        <div className={styles.signIn}>
          {isSignedIn ? (
            <React.Fragment>
              {
                userInfo && userInfo.memberid && (
                  <UserAvatar userInfo={userInfo}/>
                )
              }
              <a href="#" onClick={onSignOut}>
                <FormattedMessage id="header.sign-out" defaultMessage="Sign Out" />
              </a>
            </React.Fragment>
          ) : (
            <SignInButton />
          )}
        </div>
        {isHmc ? <SocialBar mobile /> : null}
      </Container>
    </header>
  );
}

Header.propTypes = {
  showCloud: PropTypes.bool,
  enableSpoke: PropTypes.bool,
  editorName: PropTypes.string,
  showDocsLink: PropTypes.bool,
  docsUrl: PropTypes.string,
  showSourceLink: PropTypes.bool,
  showCommunityLink: PropTypes.bool,
  communityUrl: PropTypes.string,
  isAdmin: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  email: PropTypes.string,
  userInfo: PropTypes.object,
  onSignOut: PropTypes.func,
  isHmc: PropTypes.bool
};
