# Flocksy
Facebook clone for the Odin Project's OdinBook


### Instructions:

Build a social media site! You’ll build a large portion of the core user functionality of your chosen site in this project. 
You don’t have to worry about some of the more flashy front-end stuff unless you want to, but you don’t need it to get a nice user experience.

This project will give you the chance to take a relatively high-level set of requirements and turn it into a functioning website.
You’ll need to do some of your own research and read the documentation for a few of the modules you’ll be using in this project.
Getting started

- Think about what you need to do. It’s really helpful to write your plan down on paper or a whiteboard ahead of time!
- A few hours of thought now will save you days of coding. 
- Try to lay it ALL out. An important part of planning is scope. 
- You obviously can’t build the entire website (which presumably took a full team of engineers years to produce), 
 so you’ll need to identify the site’s core functionality and the “nice-to-have” stuff. 
    Make sure you finish the core functionality BEFORE working on the rest. 
- If you try to do everything at once, you’ll get lost and frustrated. Trust us. Everything takes longer than you expect.
- Think through the data architecture required to make this work. 
- There are lots of models and the relationship between them is more complicated than anything you’ve done before.
- Take some time to plan your approach before diving in.
- Work your way down the list below! Each step will involve a new challenge, but you’ve got the tools.
- You can populate data like users and posts with fake data using the Faker module from npm. 
- To accomplish this create a new JavaScript file named seeds.js which imports your 
- Prisma models and uses the faker module to generate and save a bunch of new users.

#### Requirements

The following requirements are a very global list of features your app should have. 
Because of the open-ended nature of this project, 
it’s possible that not all of them may apply to your chosen site, and that there might be core features
of your site that aren’t mentioned here.

- Users must sign in to see anything except the sign-in page.
- Users should be able to sign in using your chosen authentication method.
- Users can send follow requests to other users.
- Users can create posts (begin with text only).
- Users can like posts.
- Users can comment on posts.
- Posts should always display the post content, author, comments, and likes.
- There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
- Users can create a profile with a profile picture. Depending on how you handle authentication, for example via passport-github2, 
    you may be able to use their account’s existing profile picture. 
- If this isn’t the case you can use Gravatar to generate them.
- A user’s profile page should contain their profile information, profile photo, and posts.
- There should be an index page for users, which shows all users and buttons for sending follow requests to users the user is not already following or have a pending request.
- Deploy your app to a hosting provider of your choice!

#### Extra credit
- Make posts also allow images (either just via a URL or by uploading one). If you did the extra credit from the File Uploader project, 
  then you may recall Cloudinary or Supabase storage being good options for hosting user-uploaded images. 
- The URLs they provide you can then be stored in your database instead of the raw image binary data.
- Allow users to update their profile photo.
- Create a guest sign-in functionality that allows visitors to bypass the login screen without creating an account or supplying credentials.
- This is especially useful if you are planning on putting this project on your résumé - most recruiters, hiring managers, etc. will not take the time to create an account.
- This feature will allow them to look at your hard work without going through a tedious sign-up process.
- Make it pretty!

