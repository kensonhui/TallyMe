# TallyMe

Tally Me serves an area where teams can vote and communicate their ideas in real-time. Hosts can choose who can view the results of each poll, and whether or not the poll stays anonymous.
Created with Express.js, Socket.IO, and React. 

![image](https://user-images.githubusercontent.com/60726802/129944250-8c35b070-074d-4bb0-ad4f-5650d614cb71.png)

# Getting Started

1. To run the application, clone the repo and install the packages for both the client and server by running

       npm i 
       cd ./client 
       npm i

2. Then to run the application

       npm run start
       
   This will concurrently run the React development server and node server on port 3000 and port 5000

3. For development purposes, run
    
       npm run dev
   
   This will run the server with hot-reloading

# Host Controls

When you create a room, a room code will be generated for users to join.
For each question, you will be able to choose whether or not the vote will be anonymous, and who the results will be displayed to. After everyone has voted, you can hit the 'End Responses' button, which will end voting and display the results.


