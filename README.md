# Planetarium.place
Multiplayer drawing application on 3D globe.
Check it out at <https://planetarium.place>. Also, I recently created a subreddit for the website here <https://www.reddit.com/r/planetariumplace/>.

## Contributing

### Become a contributor
To become a contributor, email me at wellsfletcher@gatech.edu and include your GitHub username.

### Project setup

1. Install NPM
2. Clone the repository and open it in terminal
3. Run `npm install` to install the project depencies
4. Run `npm run start` to build and run the project
5. Navigate to `http://localhost:8080/` in a web browser
6. Hopefully everything works

### Making changes to the repository

1. Make a new branch from the develop branch. On the GitHub website, go to the develop branch. Create a new branch from the develop branch 
    > <img width="959" alt="2createBranch" src="https://user-images.githubusercontent.com/30359960/158496651-50daa079-6e25-4cae-b386-5af91d22f598.png">
2. Check out the branch locally
3. Make changes
4. Create a pull request to merge back into develop
5. Add a code review. Try adding @wellsfletcher. You won't be able to merge into develop without someone else review your pull request
6. Wait for you pull request to be approved

### Completing issues

1. Go to the [Issues tab](https://github.com/wellsfletcher/PlanetariumPlace/issues) on the GitHub website to view existing issues
2. Choose an issue you want. Issues labeled "Good first issue" are probably ones you want to work on
3. Assign yourself to the issue. Otherwise, you may risk someone else implementing the feature before you and your changes not making it to production.
4. When working on an issue, include the issue number in your commit messages. Make sure to proceed it with a "#" symbol. A nicely formatted commit message may look like "#11 - added alert for when the password is too short". GitHub will automatically convert the issue number in the commit message into a hyperlink to the issue. This makes it easier to track progress on issues and keep the repository organized
5. Create a pull request for the issue

### Enabling Redux DevTools

Redux DevTools is a browser extension that is quite useful for debugging Redux React applications. Instructions can be found here https://github.com/reduxjs/redux-devtools and the Chrome extension can be found here https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

## Documentation

Most of the program contents are located under the `app/components/` folder. I may reorganize some files soon.

### Organization

...

### Important files

`BoardPage.tsx`, `Board.tsx`, `Globe.tsx`, and `reducers/index.ts` are all quite important.

### Manipulating global state with React Redux

...
