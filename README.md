# Main Project

With the rise in microservices, its hard to track outgoing request, its headers, its payload e.t.c ...


```http
/* response
@name('response')
POST https://httpbin.org/post
json({
    "ram": "ranga"
})
*/



// woudn't save request to database as no userinformation is saved
@name('request')
POST https://req.dothttp.dev/https://httpbin.org/post
json({
    "ram": "ranga"

})
/* response
@name('response')
POST https://httpbin.org/post
json({
    "ram": "ranga"
})


// this is where user woudn't want to save or add host
@name('request')
POST https://req.dothttp.dev/post
json({
    "ram": "ranga"

})
/* response
@name('response')
POST https://req.dothttp.dev/post
json({
    "ram": "ranga"
})
*/
```

User
1) User needs to be logged in


## Tasks
- [x] accept POST
- [x] accept GET
- [x] accept HEAD
- [x] accept query
- [x] accept body
- [ ] accept filetypes
- [x] if Accept header has 'application/html' --> sends html response
- [ ] if Accept header has '*' --> sends html response 
- [x] if Accept header is not defined --> sends plain text
- [x] if Accept header is not defined --> sends plain text