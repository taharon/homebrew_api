
# Ægir's Corner

  This application allows users to save recipes for beers which they've brewed, so they can view and edit them later. The users can dynamically add more resources to the form which are added to the state variable which represents their recipe.

## Links

  [Deployed Application](https://taharon.github.io/homebrew_client/#/)  
  [Client Repository](https://github.com/taharon/homebrew_client)  

## Technologies

    This application was created using the following technologies
    * HTML
    * CSS
    * Bootstrap
    * React
    * JavaScript
    * Axios
    * MongoDB
    * Mongoose
    * Express

## My Journey

  I began with wireframes for the layout of the client side, in order to get an idea for what the forms should contain. Once
  I established a solid idea of what resources I needed for the forms, built the ERD out of the exact same data, which allowed me to I created the routes and a model which expected the exact same data.
  This allowed me to quickly and easily create the API side of my app, and then move back to tackling the meat of my project, the dynamic addition of forms. This required a lot of research, as it is not straightforward to dynamically add to state variables in react, especially such deeply nested ones. As always, I turned first to stackoverflow, however I was unable to find a clear answer to my problem. I eventually reached out to the instructors after being unable to solve it myself.

## User Stories

    * As an unregistered user, I'd like to register  
    * As a registered user, I'd like to log in  
    * As a logged in user, I'd like to see my own brews  
    * As a logged in user, I'd like to create a new brew  
    * As a logged in user, I'd like to sign out  
    * As a logged in user, I'd like to change my password  

## Stretch Goal Stories

    * As a logged in user, I'd like to sort by brew style  
    * As a logged in user, I'd like to find a random brew of a style  
    * As a logged in user, I'd like to view everyone's brews  
    * As a logged in user, I'd like to save other people's brews  

## ERD

  ![Initial ERD](https://i.imgur.com/FM8DvoQ.png)

## API End Points

| Verb   | URI Pattern            |
|--------|------------------------|
| POST   | `/sign-up`             |
| POST   | `/sign-in`             |
| DELETE | `/sign-out`            |
| PATCH  | `/change-password`     |
| GET    | `/brews`               |
| POST   | `/brews`               |
| GET    | `/brews/:id`           |
| PATCH  | `/brews/:id`           |
| DELETE | `/brews/:id`           |

### Installation

  Installation requires only an npm install.
