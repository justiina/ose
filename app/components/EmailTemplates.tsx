import * as React from "react";

interface RegisterTemplateProps {
  firstName: string;
  registrationLink: string;
}

interface ResetPasswordTemplateProps {
  resetLink: string;
}

export const RegisterTemplate: React.FC<Readonly<RegisterTemplateProps>> = ({
  firstName,
  registrationLink,
}) => (
  <div>
    <h1>Tervetuloa OSEn jäsensivustolle, {firstName}!</h1>
    <p>Klikkaa alla olevaa linkkiä rekisteröityäksesi sivustolle:</p>
    <a href={registrationLink}>{registrationLink}</a>
  </div>
);

export const ResetPasswordTemplate: React.FC<Readonly<ResetPasswordTemplateProps>> = ({
  resetLink,
}) => (
  <div>
    <h1>Salasanan nollaus OSEn jäsensivustolle</h1>
    <p>Klikkaa alla olevaa linkkiä nollataksesi salasanasi:</p>
    <a href={resetLink}>{resetLink}</a>
  </div>
);
