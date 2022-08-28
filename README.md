# NodeJS-Project-4-natours

`
node .\dev-data\data\import-dev-data.js --delete
`

`
node .\dev-data\data\import-dev-data.js --import
`

### VS-Code Extensions
```
Prettier - Code formatter
ESLint
```

### Dependencies
**dev**

``
npm i < list packages name > --save-dev
``
* eslint 
* prettier  
* eslint-config-prettier 
* eslint-plugin-prettier
* eslint-config-airbnb 
* eslint-plugin-node 
* eslint-plugin-import  
* eslint-plugin-jsx-a11y 
* eslint-plugin-react

**global**
``
npm i < list packages name > --global
``
* ndb 

### ENV 
**config.env file**
```
NODE_ENV=development
PORT=3015
DATABASE_PASSWORD= <mongo_atlas_password>
DATABASE_USERNAME= <mongo_atlas_username>
DATABASE= mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.pmuga.mongodb.net/<collection>?retryWrites=true&w=majority
```