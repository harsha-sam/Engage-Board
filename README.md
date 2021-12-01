# Engage Board

**Engage Board is an easy-to-use, all-in-one web application to create and manage virtual classroom communities for your university with an array of extra features and add-ons that enrich the discussions and makes the collaboration smooth.** 

### App Link:
**Note: The app can be a bit slow as it is deployed on free tier**
<br />
[https://engage-board-frontend.herokuapp.com/](https://engage-board-frontend.herokuapp.com/)

---

# Project Overview / Flow Chart

![Flowchart.jpg](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Flowchart.jpg)

---

# Tech Stack

**Frontend**: React JS & Ant-D Framework

**Backend**: Node & Express JS

**Db / ORM**: Postgres DB / Sequelize ORM

- External Libraries / Services Used:
    - **Bcrypt:** To hash user passwords
    - **Json Web Token**: For Authorization
    - **Socket.io:** For realtime chat feature
    - **React-Quill :** Text editor to manage notes
    - **Send grid:** To send emails
    - **Azure Cognitive Services Content Moderator :** For profanity check in messages

**Deployment**

- Frontend & Backend - Heroku
- Database - Azure Database for PostgreSQL

---

# How to install / run locally ?

- Install all dependencies
    - Client-Side : From the client directory run `npm install`
    - Server-Side: From the server directory run `npm install`
- Creating env file
    
    In both client and server directory:
    
    - Fill the variables show in `.env.sample` file with required values/keys and rename the file to `.env`
    
    <br />
    Note: You can find the env file in supporting documents

- Check / Run migrations on DB
    - In server directory run `npx sequelize-cli db:migrate`
- Run :
    - Client-Side : From the client directory run `npm start`
    - Server-Side: From the server directory run `npm start`

---

# Design

App Flowchart: [https://miro.com/app/board/uXjVOfBScUM=/?invite_link_id=653732207396](https://miro.com/app/board/uXjVOfBScUM=/?invite_link_id=653732207396) 

UI Wireframes: [https://whimsical.com/msft-engage-21-WNr88UyFTGPKTCz5kF7caE](https://whimsical.com/msft-engage-21-WNr88UyFTGPKTCz5kF7caE)

Database Design : [https://dbdiagram.io/d/61890d4702cf5d186b4b12d2](https://dbdiagram.io/d/61890d4702cf5d186b4b12d2)

---

# Features

## **Authentication**

- **Registration**
    - User must provide `unique university enrollment ID (identification number in the university)`.
    - User must provide a `Unique Email ID.`
    - User must register either as a 
    - Faculty or
    - Student
    
    **Note: Please provide a valid email address at registration as the app even has an email notification feature for some use cases.**
    <br />
    <aside>
    💡 What happens if there is already a user with the same university enrollment ID or with the same email address?
    
    → A validation error occurs.
    
    </aside>
    
    <aside>
    💡 How are passwords stored?
    
    → Passwords are securely hashed and stored
    
    </aside>
    

---

- **Log In**
    - User should log in with an email and password.
    <br />
    <aside>
    💡 Can I access any route of the app without logging in?

    → No, a user can only access routes after logging in.
    
    </aside>
    
    <aside>
    💡 Should I re-login every time after refreshing the page?

    → No, JWT is used to authenticate the user. The user's state will persist as long as the token is valid. After the token expires, the user will be prompted to log in again.
    
    </aside>
    

---

## Classrooms

- A classroom is a space made by specific faculty for a group/community of students.

> Only faculties can create classrooms.
> 

A user can see three tabs on the classrooms page:

- **Your Classrooms Tab**: Displays list of classrooms in which the user is a member
- **Browse Classrooms Tab**: Displays list of classrooms in which the user is not a member
> A user can request to join the classroom
- **Pending Requests Tab**: Displays list of classrooms which the user requested to join and the admin still didn't accept the request are shown here
> A user can withdraw requests to join a classroom.

<br />
<aside>
💡 What happens when I request to join a classroom?

→ An email is sent to the admin of the classroom notifying about the request as shown below

</aside>

![image (1).png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/image_(1).png)

---

## Classroom

- Each classroom will have three roles:
    1. Admin  (Faculty who created the classroom) 
    2. Monitor (Students / Other Faculty who can act as TA's or CR's) 
    3. Students
    
> **Monitors are Teaching Assistants / Class Representatives picked by the admin.**
> 

- A classroom will have :
    - Channel - The place where members of the classroom interact with each other through text messages.
    - Category - Used to organize Channels into sections that users can collapse and expand.
    
> **Channels have messaging permissions associated with their role in the classroom.**
> 
    
- Admin / Monitor can :
    1. Update content moderation settings of a classroom.
    2. Add / Remove Users from the classroom.
    3. Add / Remove / Update channels of a classroom.

- Some Default Channels are created on creation of a classroom.

- Chat - Implemented using socket.io
    - Users can text, send emojis and interact with other members of the classroom in real-time.
    - A user can edit/delete their messages.
    - A user can react (Like, Smile, Frown, Heart ) to messages.

> To ensure the discussions in a classroom are responsible, admin/monitors can enable **content moderation in the classroom** which makes sure to auto-delete the messages from now which have abusive/offensive language. A warning email will also be sent to the user who sent that message.
> 
- By default, content moderation is enabled in classroom on the creation.
- A member of the classroom can also leave the classroom.

<aside>
💡 What happens when the admin leaves a classroom ?

→ The classroom is deleted when the admin leaves it. Admin is supposed to be the in-charge of the classroom. Hence, a classroom cannot be without an admin.

</aside>

<aside>
💡 Can I create a Category with the same name as any other existing category of a classroom? 

→ No, a validation error occurs. There cannot be duplicate categories with the same name in a classroom.

</aside>

<aside>
💡 Can I create a Channel with the same name as any other existing channel in a category?

→ No, a validation error occurs. There cannot be duplicate channels with the same name in a category of a classroom.

</aside>

<aside>
💡 Are Channels soft deleted?

→ No, the Channels and Messages associated are permanently deleted.

</aside>

---

## Direct Messages (DM)

- Direct Messages allow you to have one-on-one / private conversations with other users.
- A user can search for other users based on their **ID or Full Name** and send the message.

<aside>
💡 Can I direct message myself?

→ Yes, you can. Search the list of users by your ID and send the message.

</aside>

<aside>
💡 Can anyone access my one-on-one conversations?

→ No, these are secure. Only the person to whom the message is sent can view it.

</aside>

---

## Notes

- Notes feature of the app uses **Quill, a powerful and rich text editor.**
- A user can create, maintain and delete private notes. Images can also be attached in a note.
- A user can share a note with others by sharing the route of the note. Anyone with that link can view the note. But other users are not permitted to edit the note.

<aside>
💡 How notes feature is helpful?

→ A use case where a faculty in a classroom wants to hand over some homework/assignments/any questionnaire. With the help of the notes feature, a faculty can prepare the note with require info and share the URL in the classroom. All students can now view the note and understand.

</aside>

---

## Update User Profile

- A user can update their **Email ID or Full name.**

<aside>
💡 Can I update my University Enrollment ID

→ No, the app still does not support updating **University Enrollment ID** as it is a primary constraint in identifying users uniquely.

</aside>

---

## Accessibility

- Engage Board is also friendly to those students/users with **Dyslexia** who face difficulty in reading.
- By toggling the accessibility icon (on the extreme right) of the navbar will transform the entire app font to **OpenDyslexic font** as shown below.

![Screenshot 2021-11-26 at 3.40.52 PM.png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Screenshot_2021-11-26_at_3.40.52_PM.png)

---

## Security

- App uses JWT middleware-based authentication and verifies the user before processing API requests.
- Passwords are hashed and stored in DB.
- Only a faculty can create classrooms.
- Users cannot access the classrooms of which they are not a member.
- A Channel Messages cannot be seen in other channels/classrooms.
- Direct messages between two users can only be accessed by those two.
- A note content can only be updated/deleted by the user who created it.
- Invalid routes will show a **404 Page.**

---

## App Screens

Login:

![Screenshot 2021-11-26 at 4.04.30 PM.png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Screenshot_2021-11-26_at_4.04.30_PM.png)

Register:

![Screenshot 2021-11-26 at 4.04.38 PM.png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Screenshot_2021-11-26_at_4.04.38_PM.png)

Classrooms:

![Screenshot 2021-11-26 at 4.20.33 PM.png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Screenshot_2021-11-26_at_4.20.33_PM.png)

Classroom:

![Screenshot 2021-11-26 at 4.25.56 PM.png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Screenshot_2021-11-26_at_4.25.56_PM.png)

Note:

![Screenshot 2021-11-26 at 4.34.38 PM.png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Screenshot_2021-11-26_at_4.34.38_PM.png)

Error Page

![Screenshot 2021-11-26 at 4.27.06 PM.png](Engage%20Board%20Documentation%206ecc547e330e46288957e5664217774b/Screenshot_2021-11-26_at_4.27.06_PM.png)

---
