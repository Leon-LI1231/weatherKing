# Project_13



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://git.doit.wisc.edu/cdis/cs/courses/cs506/fa2025/team/T_13/Project_13.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://git.doit.wisc.edu/cdis/cs/courses/cs506/fa2025/team/T_13/Project_13/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
WeatherKings: A weather prediction game

## Description
DraftUWeather is a weather prediction game where users forecast daily conditions (temperature, wind, precipitation) and compete for accuracy.
Players earn points based on how close their predictions are to real-world data from APIs such as OpenWeather or NOAA HRRR. The system will compare user predictions to actual data and generate a score which can be posted on a global leaderboard. Additional features could be a 'Forecast of the day' or 'WildCard Weather Guess' where users guess on certain weather conditions occuring. 

## Project Architecture  
Our system will use **three Docker containers** to create a full-stack application.

### Components  
- **Frontend**: React Native  
  - Displays the UI for entering predictions and viewing results  
- **Backend**: Spring Boot  
  - Handles REST API logic, scoring, and data requests  
- **Database**: MySQL  
  - Stores users, predictions, scores, and weather data  

### Data Flow  
React Native (Frontend) → Spring Boot (Backend) → MySQL (Database)  
The backend will also connect to external APIs (OpenWeather, NOAA HRRR) to fetch real weather data for scoring.

## Project Specifications  

**Core Features**  
- Submit daily predictions for weather metrics  
- Fetch real data from public weather APIs  
- Calculate and display scores based on prediction accuracy  
- Maintain a leaderboard of user performance  

**Additional Features (Planned)**  
- Forecast of the Day challenge  
- Wildcard Weather Guess mode  
- Graphs or trends showing user accuracy over time  

**Technical Goals**  
- Containerized deployment using Docker Compose  
- RESTful communication between frontend and backend  
- Persistent storage of users and predictions  

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge. At this moment - N/A

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method. At this moment - N/A

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection. At this moment - N/A

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README. At this moment - N/A

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc. Piazza or Email TAs/Professor

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser. At this moment - N/A

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.
Kaden
Sri
Leon
Sam
Manuel
Krishna

## License
For open source projects, say how it is licensed. At this moment - N/A

## Project status
Sprint 0 – Planning Phase and Documentation setup Phase 
Architecture and specifications defined. 
No Development yet.

