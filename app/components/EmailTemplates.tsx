import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  registrationLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  registrationLink,
}) => (
  <div>
    <h1>Tervetuloa OSEn jäsensivustolle, {firstName}!</h1>
    <p>Klikkaa alla olevaa linkkiä rekisteröityäksesi sivustolle:</p>
    <a href={registrationLink}>{registrationLink}</a>
  </div>
);
