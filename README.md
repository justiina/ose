# Member Site for Search and Rescue Organisation Oulun Seudun Etsintäkoirat OSE ry

## Introduction

This is a member site for search and rescue organisation, Oulun Seudun Etsintäkoirat OSE ry. OSE members train dogs to help police find missing person when needed. The member site gathers important events, instructions, files, and member information in one place. The site is implemented using web technologies to ensure easy access for everyone. The user interface is responsive so that the site works well on computers and mobile devices.

## Used technologies

Used framework is React-based Next.js and the language is TypeScript. User interface is implemented using Tailwind CSS. User authentication, database and file storage, are implemented using the Supabase platform.

![login page](/public/images/01_login.png "Login page")

## Implementation

### User registration

The site is available only for accepted members of the organisation. Users can thus register only via invitation send by the admin. Form containing new user's first and last name, email and info whether the new user gets admin rights or not is filled by the admin.

![invite new user form](/public/images/02_invite_user.png "Invite new user form")

Submission of the invitation form sends the invitation email to the address of new user and saves the user data to Supabase table of invited users. Invitation email contains the URL to register where the token links user to the invited users table.

The registration is completed if the token is found (and not expired) from the table and the user provides password with sufficient security qualifications. Registration creates new user, removes user info from the invited users table and adds their uid to admin table, if the new user was assigned with admin rights.

![register user form](/public/images/03_register_user.png "User registration form")

### Navigation and calendar

The navigation bar is positioned on the left side for larger screens and at the top of the screen for mobile devices and smaller window size.
A calendar component is in the main page for announcing and sharing events. Different types of events are displayed with distinct colours.

Larger screen | Smaller screen
:-----------: | :-----------:
![main page](/public/images/04_main.png "Main page with calendar") | ![main page small screen](/public/images/05_main_small.png "Smaller screen main page with calendar")

Events of the day are shown in the dialog opening when the day is clicked from the calendar.
![dialog with days events](/public/images/06_days_events.png "Dialog showing days evens")

A new event can be added using a form that opens either from the '+' button in the top-right corner of the calendar or from a dialog that appears by clicking on any day. The form requests information related to the event, and the application provides a warning if the user attempted to save the event without required information.

![add event form](/public/images/07_add_event.png "Add event form")

### User information

In the User Information page, users can edit their details and choose which information are displayed to other OSE members on the Contact Information page.

![own info](/public/images/08_own_info.png "Own information")

### Contact information
This page shows the contact information of all OSE members who have agreed to share their information to other members.

![contact info](/public/images/09_contacts.png "Contact information")

### Storage

The application includes currently storage for PDF files, allowing documents such as board meeting minutes, secretary letters, and various instructions and common practices to be collected in one place. Storage uses Supabase's Storage service, with the file name starting with the date of the meeting or secretary letter, by which the files were organized on the site. Only users with admin rights can add or remove files from the app.

![add pdf form](/public/images/10_add_pdf.png "Add pdf form")
