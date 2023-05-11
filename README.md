<img style="width:100%" src="https://user-images.githubusercontent.com/98798977/236624352-6f5440bb-1b5a-41e3-a2d2-97b5ef2b7387.png">

# GSSOC'23 Welcom To All Contributers
### About GSSoC
GirlScript Summer Of Code is a three-month-long Open-Source Program conducted every summer by the Girlscript Foundation. With constant efforts, participants contribute to numerous projects under the extreme guidance of skilled mentors over these months. With such exposure, students begin to contribute to real-world projects from the comfort of their homes. GirlScript Summer Of Code has witnessed active participation over the years, and the 2023 edition aims to carry the legacy with a promising impact.

### About Girlscript Foundation
The GirlScript Foundation is one of the leading foundations in India. It has successfully completed Five Years of educating young minds through robust initiatives. It aims to change lives by imparting tech education and relevant skills while fostering diversity. Apart from this, the Foundation is one of the world’s largest tech community for students to polish and nurture their technical skills. Our tremendous endeavors curb the gap to offer a technophilic environment and revolutionize the tech domain by promoting, sharing, and spreading knowledge equally to every individual.

______________________________________________________________________________________________________________________________________________________________

# About Our Project

**Name** - GameSphere 

**Technologies Used** - HTML, CSS, JavaScript, Bootstrap, WebSocket, jQuery, PHP, MySQL, Laravel etc..

**Our Aim** - Our primary goal is to create a website where two or more friends can gather and play games online (such as multiplayer) without having to download any software or tools to their computers or mobile devices.

**Who are able to work with Us** - UI/UX Design, Front-end developer, Backend developer, *Know about WebSocket etc.. and also if you want to contribute in different fields we wellocm you 
______________________________________________________________________________________________________________________________________________________________

# How to start to contribute in project step by step

I have distribute this project into three main parts for contributers :
| steps         | About         | Time  |
| ------------- |:-------------:| -----:|
| First step    | Creat a home page of a wrbsite | 10 - 15 days |
| second step   | buit an game and add on the website  |  15 - 20 days |
| Third Step    | Implementation for multipalyer & Rooms | 30 - 40 days |
| Final step    | Debugging and basic change if needed | 10 - 15 days |

### Firts Step -

Creat a landing page (Home Page) by using frontend development

_Detail:_ The first phase of a project is the most straightforward because all that is required of the contributor is to copy our designs (this is especially important if their designs are better than our designs) and create a landing page (or home page), which serves as a direct conduit between the user's browser and our website. The initial phase of the project is crucial because if users don't feel at ease using our website, they may quit using it completely, which is negative for our website. All contributions would have been utterly useless if this happened. in order to improve the responsiveness and dynamic experience of our users.

Refrence of designe:
                
https://snowflaketest.my.canva.site/gamesphere
               
                
 **Note** - You are also free to show you degines at (XYZ@gmail.com) currently email is not added
 ***********************************************************************************************************************************************************
                
### Second Step - 

Add different types of game be like Snake, Ludo, Carrom, Bubbel shoot etc.

_Detail:_ In a second step the developer just be need develop multiple game(be like Ludo, Carrom, Bubble shooter, snake games etc..) and list into the website and also create an special page for a particular game where all instruction are presnt how to play that game and also collect the users review and ther experience with our website if you want to be check out the reference of designe just copy the link and paste into browser and also if you have any other ideads related to designes please discuss with us.

Also builds game main page Reference of designe page is given below:
                 
https://snowflaketest.my.canva.site/game-detail
                 
                 
 **Note** - You are also free to show you degines at (XYZ@gmail.com) currently email is not added
                
***********************************************************************************************************************************************************

### Third Step - 

Here you are creat a room for players where the meat with different players

_Detail:_ Thiird step is hardest part of project acording to me. I have to find one random online user and transfer real -time data netween both of them . you all are familar with whatsapp when we are chatting with our friends under the hood whatsapp will transmit messege from one socket to anotner but when it comes to group chatting transmitting message from socket to sockot is not efficient so whatsapp creats a room it has a unique ID and inside that all socket will be there here messege transmit from socket to rom i am going to use this room's conapt to build this game 
let's take an example user clicks on play we redirut into game main page where we give two options. 

**play with stranger.** 

**play with friends.** 

when users click on play with stranger button i will sand a room creat even from the frontend on the backend i will creat a room with a unique ID and join the user in that room to join another player in this room  i need room ID so i have to save room detail somewhere.I will save room ID in a array called room if another user clicks on that button first i will checj there any room available from that array if the room is available i will make this user to join the room is an issue here.

I only ewent towi player to join ths room to fix this i will add avariable calledvaccent to check if the roon is avariable or not to have a track of player info like socket ID option ,option scora and option lock will savr data  in player object now i need to sand this detail to the frontend we rea sending a room gate even from the backend  i hope you undrestood what i said now talk to play with friend button , sharing a link i will take the room ID from that link and check if is there any room available with a given ID if there a room exit then i will check if its availableand vacant then user can join the else i will redirect him to the home page currently any user can join the room if"s awakend .To save this i will current a prive rooms for those who click on a play with the friend button .                  

 **Note** - You are also free to talk if you have any batter idea
 
 ______________________________________________________________________________________________________________________________________________________________
 
# How to make a PR in a Project

If you are intrested to contribute in this project how to start contribute
<!-- in detail -->

1. Fork the repo.

2. After forking, clone the repo to your local machine.
To clone the repo to your local machine, run the following command in your terminal:
    
    ```bash
    git clone https://github.com/<your-github-username>/GameSphere
    ```

3. Add a remote upstream to the original repo.
To add a remote upstream, run the following command in your terminal:
    
    ```bash
    git remote add upstream https://github.com/Durgesh4993/GameSphere/
    ```

4. Create a new branch.
To create a new branch, run the following command in your terminal:
    
    ```bash
    git checkout -b <your-branch-name>
    ```

5. Make changes in source code.

6. Add your changes
To add your changes, run the following command in your terminal:
    
    ```bash
    git add <File1 changed> <File2 changed> ...
    ```
7. Commit your changes.
To commit your changes, run the following command in your terminal:
    
    ```bash
    git commit -m "<your-commit-message>"
    ```

8. Push your changes.
To push your changes, run the following command in your terminal:
    
    ```bash
    git push origin <your-branch-name>
    ```

9. Create a PR.

__________________________________________________________________________________________________________________________________________________________________

## Alternatively Using GitHub Deslktop:
1. Open GitHub Desktop and log in to your GitHub account.

2. Make sure you are on the "Current Repository" view. If not, go to "File" and select "Add Local Repository" to add your repository.

3. In the "Current Repository" view, ensure you are on the branch that you want to submit a pull request for. If you're not on the correct branch, use the "Branch" menu to switch to the correct branch.

4. Once you're on the correct branch, make your changes and commit them to the branch. You can do this by clicking the "+" button in the upper-left corner of the GitHub Desktop window, making your changes, and then entering a commit message.

5. After you've made your changes and committed them, click the "Push origin" button in the top-right corner of the GitHub Desktop window. This will push your changes to the remote repository on GitHub.

6. Now, go to the GitHub website, navigate to your fork of the repository, and you should see a button to "Compare & pull request" between your fork and the original repository, click on it.

7. On the pull request page, you can review your changes and add any additional information, such as a title and a description, that you want to include with your pull request.

8. Once you're satisfied with your pull request, click the "Create pull request" button to submit it.

**Note:** In order to create a pull request, you must have a fork of the original repository in your GitHub account and you must have made the changes in that forked repository.

___________________________________________________________________________________________________________________________________________________________________________

<h2 align='center'> Project Admin </h2>
<table align='center'>
<tr>
    <td align="center">
        <a href="https://www.linkedin.com/in/aman-singh-026141222/">
            <img src="https://media.licdn.com/dms/image/D4D03AQHLFMc05n4axw/profile-displayphoto-shrink_400_400/0/1680535398297?e=1689206400&v=beta&t=wNTaH-noSJARU_HF-FO60P-ipOMY6EcbjkpJnqe4HuM" width="100;" alt="Aman Kumar Singh"/>
            <br />
            <sub><b>Aman Kr. Singh</b></sub>
        </a>
    </td>
  </tr>
</table>

___________________________________________________________________________________________________________________________________________________________________

<h2 align='center'> Project Mentors </h2>
<table align='center'>
<td align="center"><a href="#"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRROqd-XYednEBgFqYwzxQXkBrWBBL0wWMkYfbLpIWofxeMIXVN9gEEyk38CKSIwRhIyh7K9Va6J7s&usqp=CAU&ec=48600113" width="100px;" alt=""/><br /><sub><b> Comming Soon </b></sub></a></td>

<td align="center"><a href="#"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzscsu9oWkZQcQeYWeNyHonLaXFMxjbZdROEFnyxod7g&usqp=CAU&ec=48600113" width="100px;" alt=""/><br /><sub><b> Comming Soon </b></sub></a></td>

<td align="center"><a href="#"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO7Ip3EVgCV1vmNzE_T8YI9Pn5RbIUN4IK1xylK979Aw&usqp=CAU&ec=48600113" width="100px;" alt=""/><br /><sub><b> Comming Soon </b></sub></a></td>
</table>

